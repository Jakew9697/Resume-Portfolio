import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { cors } from 'hono/cors';
import { bodyLimit } from 'hono/body-limit';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { schemas, type Workspace } from '../src/lib/demo-data';
import { hashIp, issue, signingKey, verify } from './auth';
import { quota, read, write } from './store';
import { assistant, generate, receptionist } from './ai';
import { speak, startTranscription, transcription } from './voice';

type Env = { Variables: { session: string; ipHash: string }; Bindings: { event?: { requestContext?: { http?: { sourceIp?: string } } } } };
export const app = new Hono<Env>();
const origins = (process.env.ALLOWED_ORIGINS || 'https://jakeworsham.syncgr.com').split(',');
app.use('*', cors({ origin: origin => origins.includes(origin) ? origin : undefined, allowHeaders: ['Content-Type', 'Authorization'], allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'], maxAge: 86400 }));
app.use('*', bodyLimit({ maxSize: 3600000, onError: c => c.json({ error: 'Request is too large.' }, 413) }));
app.use('*', async (c, next) => { c.header('Cache-Control', 'no-store'); c.header('X-Content-Type-Options', 'nosniff'); await next(); });
app.get('/health', c => c.json({ status: 'ok', service: 'jake-portfolio', version: 1 }));
app.use('*', async (c, next) => {
  if (!origins.includes(c.req.header('origin') || '')) throw new HTTPException(403, { message: 'Open the demo from Jake’s portfolio.' });
  const key = await signingKey();
  const ip = c.env?.event?.requestContext?.http?.sourceIp || 'local';
  c.set('ipHash', hashIp(ip, key));
  if (c.req.path !== '/session') c.set('session', verify((c.req.header('authorization') || '').replace(/^Bearer /, ''), key));
  await next();
});
app.post('/session', async c => {
  await quota(`session-ip-${c.get('ipHash')}`, 15);
  await quota('session-global', 500, 86400);
  return c.json(issue(await signingKey()));
});
app.use('/state/*', async (c, next) => { await quota(`state-${c.get('session')}`, 300); await next(); });
app.get('/state/:workspace', async c => {
  const workspace = c.req.param('workspace');
  if (!Object.hasOwn(schemas, workspace)) throw new HTTPException(404, { message: 'Unknown workspace.' });
  return c.json(await read(c.get('session'), workspace as Workspace));
});
app.put('/state/:workspace', async c => {
  const workspace = c.req.param('workspace');
  if (!Object.hasOwn(schemas, workspace)) throw new HTTPException(404, { message: 'Unknown workspace.' });
  const { revision, data } = z.object({ revision: z.number().int().min(0), data: z.unknown() }).parse(await c.req.json());
  return c.json(await write(c.get('session'), workspace as Workspace, data, revision));
});
app.use('/ai/*', async (c, next) => {
  await quota(`ai-${c.get('session')}`, 35, 86400);
  await quota(`ai-ip-${c.get('ipHash')}`, 60);
  await quota('ai-global', 400, 86400);
  await next();
});
app.post('/ai/helga', async c => {
  const { message } = z.object({ message: z.string().trim().min(1).max(4000) }).parse(await c.req.json());
  return c.json(await assistant(c.get('session'), message));
});
app.post('/ai/generate', async c => {
  const { kind, section } = z.object({ kind: z.enum(['documents', 'rfp']), section: z.number().int().min(0).max(2).default(0) }).parse(await c.req.json());
  return c.json(await generate(c.get('session'), kind, section));
});
app.post('/ai/receptionist', async c => {
  const { message, finish } = z.object({ message: z.string().max(4000).default(''), finish: z.boolean().default(false) }).parse(await c.req.json());
  if (!finish && !message.trim()) throw new HTTPException(400, { message: 'Enter a message.' });
  return c.json(await receptionist(c.get('session'), message, finish));
});
app.post('/voice/speak', async c => {
  await quota(`speech-${c.get('session')}`, 60, 86400); await quota('speech-global', 600, 86400);
  const { text, voice } = z.object({ text: z.string().min(1).max(2500), voice: z.enum(['Joanna', 'Matthew']).default('Joanna') }).parse(await c.req.json());
  return c.body(new Uint8Array(await speak(text, voice)), 200, { 'Content-Type': 'audio/mpeg' });
});
app.post('/voice/transcribe', async c => {
  await quota(`recording-${c.get('session')}`, 12, 86400); await quota('recording-global', 100, 86400);
  const { audio, format } = z.object({ audio: z.string().min(10).max(3400000).regex(/^[A-Za-z0-9+/=]+$/), format: z.enum(['webm', 'mp4', 'wav']) }).parse(await c.req.json());
  return c.json(await startTranscription(c.get('session'), audio, format));
});
app.get('/voice/transcribe/:id', async c => {
  await quota(`poll-${c.get('session')}`, 300);
  return c.json(await transcription(c.get('session'), c.req.param('id')));
});
app.onError((error, c) => {
  if (error instanceof z.ZodError) return c.json({ error: 'Please check the form fields and text length.', details: error.issues.map(i => `${i.path.join('.')}: ${i.message}`).slice(0, 5) }, 400);
  if (error instanceof HTTPException) return c.json({ error: error.message }, error.status);
  if (error instanceof SyntaxError) return c.json({ error: 'Invalid request body.' }, 400);
  console.error(JSON.stringify({ name: error.name, message: error.message, path: c.req.path }));
  return c.json({ error: 'The demo service could not complete that request. Please try again.' }, 502);
});
export const handler = handle(app);
