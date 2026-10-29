import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomBytes, randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { createAppAuth } from '../server/appAuth.js';

const connectionString = process.env.WAJBA_AUTH_TEST_DATABASE_URL;

test('app OAuth uses the app callback and preserves session ownership in the existing schema', {
  skip: !connectionString,
}, async () => {
  // This URL must belong to the separate validation branch, never production.
  assert.ok(connectionString);
  assert.ok(!new URL(connectionString).hostname.includes('ep-billowing-bread-b9bfvpwr'));
  assert.ok(process.env.WAJBA_AUTH_TEST_DATABASE_URL);
  const pool = new Pool({ connectionString, max: 3 });
  const origin = 'https://wajjba.vercel.app';
  const secret = randomBytes(48).toString('base64url');
  const auth = createAppAuth(pool, {
    baseURL: origin, secret,
    googleClientId: 'isolated-test-client', googleClientSecret: 'isolated-test-secret',
  });
  const headers = { origin, 'content-type': 'application/json' };
  const signIn = (originHeader = origin) => auth.handler(new Request(`${origin}/api/auth/sign-in/social`, {
    method: 'POST', headers: { ...headers, origin: originHeader, cookie: 'oauth_validation=1' },
    body: JSON.stringify({ provider: 'google', callbackURL: `${origin}/?view=app`, disableRedirect: true }),
  }));
  try {
    const start = await signIn();
    assert.equal(start.status, 200);
    const authorization = new URL((await start.json()).url);
    assert.equal(authorization.origin, 'https://accounts.google.com');
    assert.equal(authorization.searchParams.get('redirect_uri'), `${origin}/api/auth/callback/google`);
    assert.ok(authorization.searchParams.get('state'));
    assert.ok(authorization.searchParams.get('code_challenge'));
    assert.equal((await signIn('https://untrusted.example')).status, 403);

    const userId = randomUUID();
    const sessionId = randomUUID();
    const sessionToken = randomBytes(32).toString('base64url');
    await pool.query('INSERT INTO neon_auth."user" (id,name,email,"emailVerified") VALUES ($1,$2,$3,true)', [
      userId, 'OAuth validation fixture', `${userId}@example.invalid`,
    ]);
    await pool.query('INSERT INTO neon_auth.session (id,token,"userId","expiresAt","updatedAt") VALUES ($1,$2,$3,now()+interval \'5 minutes\',now())', [sessionId, sessionToken, userId]);
    const signature = createHmac('sha256', secret).update(sessionToken).digest('base64');
    const cookie = `__Secure-better-auth.session_token=${encodeURIComponent(`${sessionToken}.${signature}`)}`;
    const getSession = () => auth.handler(new Request(`${origin}/api/auth/get-session`, { headers: { cookie } }));
    const response = await getSession();
    assert.equal(response.status, 200);
    assert.equal((await response.json()).user.id, userId);
    assert.equal(await (await auth.handler(new Request(`${origin}/api/auth/get-session`, {
      headers: { cookie: `${cookie}forged` },
    }))).json(), null);

    process.env.DATABASE_URL = connectionString;
    const { authenticatedUser } = await import('../server/auth.js');
    const req = (token: string) => ({ headers: { authorization: `Bearer session:${token}` } });
    assert.equal(await authenticatedUser(req(sessionToken) as never), userId);
    assert.equal(await authenticatedUser(req(randomBytes(32).toString('base64url')) as never), null);
    // Check database expiry as well as signed cookies.
    await pool.query(`UPDATE neon_auth.session SET "expiresAt" = now()-interval '1 minute' WHERE id=$1`, [sessionId]);
    assert.equal(await authenticatedUser(req(sessionToken) as never), null);
    assert.equal(await (await getSession()).json(), null);
  } finally {
    await pool.end();
  }
});
