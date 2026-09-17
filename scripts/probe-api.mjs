import { writeFile } from 'node:fs/promises';
const base = process.env.DEMO_API_URL?.replace(/\/$/, '');
if (!base) throw new Error('Set DEMO_API_URL');
const headers = { Origin: 'https://jakeworsham.syncgr.com', 'Content-Type': 'application/json' };
const health = await fetch(`${base}/health`); console.log('health', health.status, await health.text());
const session = await fetch(`${base}/session`, { method: 'POST', headers });
const data = await session.json();
if (!session.ok) throw new Error(JSON.stringify(data));
headers.Authorization = `Bearer ${data.token}`;
const results = [];
for (const workspace of ['prospects','helga','documents','rfp','cms','receptionist']) {
  const response = await fetch(`${base}/state/${workspace}`, { headers });
  const result = await response.json();
  results.push({ workspace, status: response.status, revision: result.revision });
}
console.log(JSON.stringify(results));
const ai = await fetch(`${base}/ai/helga`, { method: 'POST', headers, body: JSON.stringify({ message: 'What is on my calendar today? Please answer briefly.' }) });
const answer = await ai.json();
console.log('AI', ai.status, answer.answer || answer.error);
await writeFile('evidence/api-initial-probe.json', JSON.stringify({ at: new Date().toISOString(), health: health.status, results, ai: { status: ai.status, answer: answer.answer || answer.error } }, null, 2));
