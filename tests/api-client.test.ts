import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, apiErrorMessage, apiRequest, kindFromStatus } from '../src/lib/api';

const json = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function sequence(...steps: Array<Response | Error | 'hang'>) {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const impl = ((url: string, init: RequestInit) => {
    calls.push({ url, init });
    const step = steps[Math.min(calls.length - 1, steps.length - 1)];
    if (step === 'hang') {
      return new Promise((_, reject) => {
        init.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    }
    return step instanceof Error ? Promise.reject(step) : Promise.resolve(step);
  }) as unknown as typeof fetch;
  return { impl, calls };
}

test('status codes map to error kinds', () => {
  assert.equal(kindFromStatus(401), 'auth');
  assert.equal(kindFromStatus(403), 'forbidden');
  assert.equal(kindFromStatus(409), 'conflict');
  assert.equal(kindFromStatus(413), 'too-large');
  assert.equal(kindFromStatus(429), 'rate-limit');
  assert.equal(kindFromStatus(503), 'unavailable');
  assert.equal(kindFromStatus(500), 'server');
  assert.equal(kindFromStatus(400), 'client');
});

test('sends the session bearer token and JSON body', async () => {
  const { impl, calls } = sequence(json(200, { saved: true }));
  const result = await apiRequest<{ saved: boolean }>('/api/backup', { method: 'PUT', token: 'abc', body: { a: 1 }, fetchImpl: impl });
  assert.deepEqual(result, { saved: true });
  const headers = calls[0].init.headers as Record<string, string>;
  assert.equal(headers.Authorization, 'Bearer session:abc');
  assert.equal(headers['Content-Type'], 'application/json');
  assert.equal(calls[0].init.body, '{"a":1}');
});

test('GET retries once on a server error and then succeeds', async () => {
  const { impl, calls } = sequence(json(500), json(200, { ok: 1 }));
  assert.deepEqual(await apiRequest('/api/groups', { fetchImpl: impl, backoffMs: 1 }), { ok: 1 });
  assert.equal(calls.length, 2);
});

test('POST is not retried unless marked idempotent', async () => {
  const post = sequence(json(500));
  await assert.rejects(apiRequest('/api/groups', { method: 'POST', body: {}, fetchImpl: post.impl, backoffMs: 1 }), (e: ApiError) => e.kind === 'server');
  assert.equal(post.calls.length, 1);
  const put = sequence(json(500), json(200, { saved: true }));
  assert.deepEqual(await apiRequest('/api/backup', { method: 'PUT', body: {}, idempotent: true, fetchImpl: put.impl, backoffMs: 1 }), { saved: true });
  assert.equal(put.calls.length, 2);
});

test('auth, conflict and rate-limit errors are never retried', async () => {
  for (const status of [401, 409, 429]) {
    const { impl, calls } = sequence(json(status));
    await assert.rejects(apiRequest('/api/groups', { fetchImpl: impl, backoffMs: 1 }), (e: ApiError) => e.status === status);
    assert.equal(calls.length, 1, `status ${status}`);
  }
});

test('a hanging request times out as a retryable timeout error', async () => {
  const { impl, calls } = sequence('hang');
  await assert.rejects(
    apiRequest('/api/groups', { fetchImpl: impl, timeoutMs: 20, retries: 1, backoffMs: 1 }),
    (e: ApiError) => e.kind === 'timeout' && e.retryable,
  );
  assert.equal(calls.length, 2);
});

test('network failure and non-JSON answers become typed errors', async () => {
  await assert.rejects(apiRequest('/x', { fetchImpl: sequence(new TypeError('failed')).impl, retries: 0 }), (e: ApiError) => e.kind === 'network');
  const html = new Response('<html>', { status: 200 });
  await assert.rejects(apiRequest('/x', { fetchImpl: sequence(html).impl, retries: 0 }), (e: ApiError) => e.kind === 'invalid');
});

test('caller cancellation is passed through and not retried', async () => {
  const controller = new AbortController();
  const { impl, calls } = sequence('hang');
  const pending = apiRequest('/x', { fetchImpl: impl, signal: controller.signal, timeoutMs: 5_000, retries: 2, backoffMs: 1 });
  controller.abort();
  await assert.rejects(pending, (e: Error) => e.name === 'AbortError');
  assert.equal(calls.length, 1);
});

test('error messages are bilingual and never expose server text', () => {
  assert.match(apiErrorMessage(new ApiError('auth', 401), false), /expired/);
  assert.match(apiErrorMessage(new ApiError('auth', 401), true), /انتهت الجلسة/);
  assert.match(apiErrorMessage(new Error('boom: SELECT * FROM'), false), /Request failed/);
});
