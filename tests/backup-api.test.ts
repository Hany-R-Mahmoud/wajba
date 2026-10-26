import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { IncomingMessage, ServerResponse } from 'node:http';

process.env.NEON_AUTH_BASE_URL = 'https://example.invalid/neondb/auth';
process.env.DATABASE_URL = 'postgresql://example.invalid/neondb';
const { default: handler } = await import('../api/backup');

async function request(method: string, authorization?: string) {
  let statusCode = 200;
  let body = '';
  const headers: Record<string, string> = {};
  await handler({ method, headers: { authorization } } as IncomingMessage, {
    setHeader(key: string, value: string) { headers[key] = value; },
    set statusCode(value: number) { statusCode = value; },
    end(value: string) { body = value; },
  } as unknown as ServerResponse);
  return { statusCode, body: JSON.parse(body), headers };
}

test('cloud backup rejects missing and malformed credentials before database access', async () => {
  for (const authorization of [undefined, 'Basic invalid', 'Bearer invalid']) {
    const result = await request('GET', authorization);
    assert.equal(result.statusCode, 401);
    assert.equal(result.headers['Cache-Control'], 'no-store');
  }
});

test('cloud backup rejects unsupported mutation methods', async () => {
  const result = await request('DELETE');
  assert.equal(result.statusCode, 405);
  assert.equal(result.headers.Allow, 'GET, PUT');
});
