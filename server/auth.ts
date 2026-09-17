import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { HTTPException } from 'hono/http-exception';
let secret: string;
export async function signingKey() {
  if (!secret) {
    const { Parameter } = await new SSMClient({}).send(new GetParameterCommand({ Name: process.env.SIGNING_PARAMETER!, WithDecryption: true }));
    if (!Parameter?.Value) throw new Error('Signing configuration missing');
    secret = Parameter.Value;
  }
  return secret;
}
export function issue(key: string) {
  const expiresAt = Date.now() + 86400000;
  const payload = Buffer.from(JSON.stringify({ id: randomUUID(), expiresAt })).toString('base64url');
  return { token: `${payload}.${createHmac('sha256', key).update(payload).digest('base64url')}`, expiresAt };
}
export function verify(token: string, key: string) {
  try {
    if (token.length > 500) throw new Error();
    const [payload, signature, extra] = token.split('.');
    if (extra || !payload || !signature) throw new Error();
    const expected = createHmac('sha256', key).update(payload).digest();
    const received = Buffer.from(signature, 'base64url');
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) throw new Error();
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!/^[a-f0-9-]{36}$/.test(data.id) || !Number.isFinite(data.expiresAt) || data.expiresAt < Date.now()) throw new Error();
    return data.id as string;
  } catch { throw new HTTPException(401, { message: 'Your demo session expired. Reload to start a fresh workspace.' }); }
}
export const hashIp = (ip: string, key: string) => createHmac('sha256', key).update(ip).digest('hex').slice(0, 24);
