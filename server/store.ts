import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { HTTPException } from 'hono/http-exception';
import { schemas, seeds, type Workspace, type WorkspaceData } from '../src/lib/demo-data';

export const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } });
export const table = process.env.TABLE_NAME!;
export const expires = () => Math.floor(Date.now() / 1000) + 86400;
export async function quota(key: string, max: number, windowSeconds = 3600) {
  const window = Math.floor(Date.now() / (windowSeconds * 1000));
  try {
    await db.send(new UpdateCommand({ TableName: table, Key: { pk: `RATE#${key}#${window}`, sk: 'RATE' },
      UpdateExpression: 'SET expiresAt = :ttl ADD used :one', ConditionExpression: 'attribute_not_exists(used) OR used < :max',
      ExpressionAttributeValues: { ':ttl': expires(), ':one': 1, ':max': max } }));
  } catch (error) {
    if ((error as Error).name === 'ConditionalCheckFailedException') throw new HTTPException(429, { message: 'This demo has reached its usage allowance. Please try again later.' });
    throw error;
  }
}
export async function read<K extends Workspace>(session: string, workspace: K): Promise<{ data: WorkspaceData<K>; revision: number }> {
  const { Item } = await db.send(new GetCommand({ TableName: table, Key: { pk: `SESSION#${session}`, sk: workspace }, ConsistentRead: true }));
  if (!Item || Item.expiresAt <= Date.now() / 1000) return { data: structuredClone(seeds[workspace]) as WorkspaceData<K>, revision: 0 };
  return { data: schemas[workspace].parse(Item.data) as WorkspaceData<K>, revision: Item.revision };
}
export async function write<K extends Workspace>(session: string, workspace: K, data: unknown, revision: number) {
  const parsed = schemas[workspace].parse(data);
  if (Buffer.byteLength(JSON.stringify(parsed)) > 250000) throw new HTTPException(413, { message: 'Workspace is full. Remove older items before saving.' });
  try {
    await db.send(new PutCommand({ TableName: table, Item: { pk: `SESSION#${session}`, sk: workspace, data: parsed, revision: revision + 1, expiresAt: expires() },
      ConditionExpression: revision === 0 ? 'attribute_not_exists(pk) OR expiresAt <= :now' : 'revision = :revision',
      ExpressionAttributeValues: revision === 0 ? { ':now': Math.floor(Date.now() / 1000) } : { ':revision': revision } }));
  } catch (error) {
    if ((error as Error).name === 'ConditionalCheckFailedException') throw new HTTPException(409, { message: 'This workspace changed in another tab. Reload to get the latest version.' });
    throw error;
  }
  return { data: parsed, revision: revision + 1 };
}
