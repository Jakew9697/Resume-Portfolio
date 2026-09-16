import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { issue, verify } from './auth';
import { schemas, seeds } from '../src/lib/demo-data';
test('guest sessions verify only under their signing key and reject tampering', () => {
  const key = randomBytes(32).toString('hex');
  const { token } = issue(key);
  assert.match(verify(token, key), /^[a-f0-9-]{36}$/);
  assert.throws(() => verify(token, randomBytes(32).toString('hex')));
  assert.throws(() => verify(`x${token}`, key));
  assert.throws(() => verify(`${token}.extra`, key));
});
test('all synthetic workspaces satisfy bounded input contracts', () => {
  for (const key of Object.keys(schemas) as (keyof typeof schemas)[]) assert.ok(schemas[key].safeParse(seeds[key]).success, key);
  assert.equal(schemas.prospects.safeParse({ prospects: [{ ...seeds.prospects.prospects[0], value: -10 }] }).success, false);
  assert.equal(schemas.prospects.safeParse({ prospects: [{ ...seeds.prospects.prospects[0], latitude: 91, longitude: -85 }] }).success, false);
  const mapped = schemas.prospects.parse({ prospects: [{ ...seeds.prospects.prospects[0], latitude: 42.96, longitude: -85.66, state: 'Michigan', zip: '49503', priority: true, future: true }] });
  assert.equal(mapped.prospects[0].future, true);
  assert.equal(mapped.prospects[0].zip, '49503');
  assert.equal(schemas.rfp.safeParse({ ...seeds.rfp, sources: [{ name: 'large', text: 'x'.repeat(24001) }] }).success, false);
});
