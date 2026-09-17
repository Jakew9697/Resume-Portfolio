import assert from 'node:assert/strict';
import { writeFile, readFile } from 'node:fs/promises';
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

const base = process.env.DEMO_API_URL?.replace(/\/$/, '');
if (!base) throw new Error('Set DEMO_API_URL');
const origin = 'https://jakeworsham.syncgr.com';
const headers = { Origin: origin, 'Content-Type': 'application/json' };
const checks = [];
const pass = (name, details = {}) => { checks.push({ name, passed: true, ...details }); console.log('PASS', name); };
async function request(path, body, method, custom = headers) {
  return fetch(`${base}${path}`, { method: method || (body === undefined ? 'GET' : 'POST'), headers: custom, body: body === undefined ? undefined : JSON.stringify(body) });
}
async function json(path, body, method) {
  const response = await request(path, body, method);
  const data = await response.json();
  assert.equal(response.status, 200, `${path}: ${JSON.stringify(data)}`);
  return data;
}
try {
  if (!process.env.VOICE_ONLY) {
  assert.equal((await fetch(`${base}/health`)).status, 200); pass('Public health');
  assert.equal((await request('/session', {}, 'POST', { ...headers, Origin: 'https://example.com' })).status, 403); pass('Origin rejected');
  assert.equal((await request('/state/helga')).status, 401); pass('Missing token rejected');
  const session = await json('/session', {}); headers.Authorization = `Bearer ${session.token}`;
  assert.equal((await request('/state/helga', undefined, undefined, { ...headers, Authorization: 'Bearer invalid' })).status, 401); pass('Invalid token rejected');
  assert.equal((await request('/state/toString')).status, 404); pass('Unknown workspace rejected');
  const prospects = await json('/state/prospects');
  const item = { ...prospects.data.prospects[0], id: 'integration-test', company: 'Integration sample' };
  const saved = await json('/state/prospects', { revision: prospects.revision, data: { prospects: [...prospects.data.prospects, item] } }, 'PUT');
  assert.equal((await json('/state/prospects')).data.prospects.at(-1).company, item.company); pass('Prospect saved and read');
  assert.equal((await request('/state/prospects', { revision: 0, data: prospects.data }, 'PUT')).status, 409); pass('Stale write rejected');
  assert.equal((await request('/state/prospects', { revision: saved.revision, data: { prospects: [{ ...item, value: -1 }] } }, 'PUT')).status, 400); pass('Invalid form rejected');
  const other = await json('/session', {});
  const isolated = await request('/state/prospects', undefined, undefined, { ...headers, Authorization: `Bearer ${other.token}` });
  assert.equal((await isolated.json()).data.prospects.length, prospects.data.prospects.length); pass('Independent guest isolation');
  const task = await json('/ai/helga', { message: 'Add a task called Review the live portfolio. Also add an event called Portfolio walkthrough at 16:00 today, and save an email draft with subject Portfolio ready and body The demonstration is ready for review. Do all three now.' });
  assert.ok(task.data.tasks.some(t => t.title.includes('Review the live portfolio')));
  assert.ok(task.data.events.some(e => e.title.includes('Portfolio walkthrough')));
  assert.ok(task.data.drafts.some(d => d.subject.includes('Portfolio ready')));
  assert.ok(!task.answer.includes('<thinking>')); pass('Helga tools save task, calendar event and email draft', { actions: task.actions });
  const completed = await json('/ai/helga', { message: 'Mark Review the live portfolio complete.' });
  assert.ok(completed.data.tasks.find(t => t.title.includes('Review the live portfolio')).done); pass('Helga completion saves');
  const document = await json('/ai/generate', { kind: 'documents' });
  assert.ok(document.data.body.length > 400); pass('Document generated and persisted', { characters: document.data.body.length });
  const rfp = await json('/ai/generate', { kind: 'rfp', section: 1 });
  assert.ok(rfp.data.sections[1].body.includes('Studio qualifications.txt'));
  assert.match(rfp.data.sections[1].body, /confirm|not provided|not supplied/i); pass('RFP cites source and marks missing experience');
  const reception = await json('/ai/receptionist', { message: 'Hi, I am Morgan. I need a repair consultation in Grand Rapids. My callback number is 616-555-0100. Please take a message.' });
  assert.ok(reception.answer.length > 30);
  const call = await json('/ai/receptionist', { finish: true });
  assert.equal(call.data.calls.length, 1); assert.match(call.answer, /Morgan/); assert.equal(call.data.messages.length, 0); pass('Receptionist stores callback and transcript');
  }
  const voiceSession = await json('/session', {}); headers.Authorization = `Bearer ${voiceSession.token}`;
  const audio = await request('/voice/speak', { text: 'Add a task to review the voice demonstration.', voice: 'Joanna' });
  assert.equal(audio.status, 200);
  const mp3 = Buffer.from(await audio.arrayBuffer()); assert.ok(mp3.length > 2000);
  await writeFile('evidence/voice-fixture.mp3', mp3);
  const fixture = await new PollyClient({ region: 'us-east-1' }).send(new SynthesizeSpeechCommand({ Text: 'Add a task to review the voice demonstration.', VoiceId: 'Joanna', Engine: 'neural', OutputFormat: 'pcm', SampleRate: '16000' }));
  const pcm = Buffer.from(await fixture.AudioStream.transformToByteArray());
  const wav = Buffer.alloc(44); wav.write('RIFF'); wav.writeUInt32LE(36 + pcm.length, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(16000, 24); wav.writeUInt32LE(32000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(pcm.length, 40);
  await writeFile('evidence/voice-fixture.wav', Buffer.concat([wav, pcm])); pass('Polly returns playable audio', { bytes: mp3.length });
  const recording = await json('/voice/transcribe', { format: 'wav', audio: (await readFile('evidence/voice-fixture.wav')).toString('base64') });
  let transcript;
  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 2000));
    transcript = await json(`/voice/transcribe/${recording.id}`);
    if (transcript.status === 'complete') break;
  }
  assert.equal(transcript.status, 'complete'); assert.match(transcript.text, /voice demonstration/i); pass('Transcribe converts real audio to text', { transcript: transcript.text });
  const stranger = await json('/session', {});
  assert.equal((await request(`/voice/transcribe/${recording.id}`, undefined, undefined, { ...headers, Authorization: `Bearer ${stranger.token}` })).status, 404); pass('Audio job ownership enforced');
  const spokenTask = await json('/ai/helga', { message: transcript.text });
  assert.ok(spokenTask.data.tasks.some(t => /voice demonstration/i.test(t.title))); pass('Voice transcript executes and saves action');
} catch (error) {
  checks.push({ name: 'Failure', passed: false, error: error.message });
  console.error(error.message); process.exitCode = 1;
} finally {
  await writeFile(`evidence/${process.env.VOICE_ONLY ? 'live-voice' : 'live-api'}-checks.json`, JSON.stringify({ at: new Date().toISOString(), api: base, checks }, null, 2));
}
