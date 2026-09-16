import { randomBytes } from 'node:crypto';
import { SSMClient, PutParameterCommand, DescribeParametersCommand } from '@aws-sdk/client-ssm';
const environment = process.argv[2];
if (!['dev', 'prod'].includes(environment)) throw new Error('Usage: node scripts/ensure-signing-key.mjs dev|prod');
const client = new SSMClient({ region: 'us-east-1' });
const Name = `/sync/jake-portfolio/${environment}/session-signing-key`;
const existing = await client.send(new DescribeParametersCommand({ ParameterFilters: [{ Key: 'Name', Option: 'Equals', Values: [Name] }] }));
if (existing.Parameters?.length) console.log('Signing key already exists in SSM; preserved.');
else {
  await client.send(new PutParameterCommand({ Name, Type: 'SecureString', Value: randomBytes(48).toString('base64url'), Description: 'Signing key for isolated expiring portfolio guest sessions', Overwrite: false }));
  console.log('Created signing key in SSM. No secret written to disk.');
}
