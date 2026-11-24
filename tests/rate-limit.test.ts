import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rateLimitHit } from '../server/rateLimit';

const fakeSql = (impl: () => Promise<unknown>) => ((..._args: unknown[]) => impl()) as never;
const user = '00000000-0000-4000-8000-000000000001';

test('rate limit allows when the database says allowed', async () => {
  assert.equal(await rateLimitHit(fakeSql(async () => [{ allowed: true }]), user, 'backup_put'), null);
});

test('rate limit refuses with the window as Retry-After', async () => {
  assert.equal(await rateLimitHit(fakeSql(async () => [{ allowed: false }]), user, 'backup_put'), 3600);
  assert.equal(await rateLimitHit(fakeSql(async () => [{ allowed: false }]), user, 'group_write'), 600);
});

test('rate limit fails open with a warning when the 005 objects are missing', async () => {
  const warn = console.warn; let warned = 0; console.warn = () => { warned++; };
  try {
    for (const code of ['42P01', '42883']) {
      assert.equal(await rateLimitHit(fakeSql(async () => { throw Object.assign(new Error('missing'), { code }); }), user, 'group_create'), null);
    }
  } finally { console.warn = warn; }
  assert.equal(warned, 2);
});

test('rate limit rethrows other database errors', async () => {
  await assert.rejects(rateLimitHit(fakeSql(async () => { throw new Error('boom'); }), user, 'group_write'), /boom/);
});
