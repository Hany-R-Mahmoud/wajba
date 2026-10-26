import type { IncomingMessage } from 'node:http';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const base = process.env.NEON_AUTH_BASE_URL;
const keys = base ? createRemoteJWKSet(new URL(`${base}/.well-known/jwks.json`)) : null;

export async function authenticatedUser(req: IncomingMessage): Promise<string | null> {
  if (!keys || !base || !req.headers.authorization?.startsWith('Bearer ')) return null;
  try {
    const { payload } = await jwtVerify(req.headers.authorization.slice(7), keys, {
      issuer: new URL(base).origin, algorithms: ['EdDSA'],
    });
    return payload.sub && payload.role !== 'anonymous' ? payload.sub : null;
  } catch { return null; }
}
