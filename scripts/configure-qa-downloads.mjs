// agent-browser 0.31 on Windows canonicalizes download folders as \\?\ paths.
// Chrome rejects those paths. Configure a normal absolute path on its existing
// browser, then use agent-browser clicks and inspect the downloaded files.
import { resolve } from 'node:path';
if (!process.env.BROWSER_CDP_URL) throw new Error('Set BROWSER_CDP_URL from agent-browser get cdp-url');
const socket = new WebSocket(process.env.BROWSER_CDP_URL);
socket.onopen = () => socket.send(JSON.stringify({ id: 1, method: 'Browser.setDownloadBehavior', params: { behavior: 'allow', downloadPath: resolve('evidence'), eventsEnabled: true } }));
socket.onmessage = event => {
  const data = JSON.parse(event.data);
  if (data.id === 1) { if (data.error) { console.error(data.error.message); process.exitCode = 1; } else console.log('QA download directory configured.'); socket.close(); }
};
socket.onerror = () => { console.error('Could not connect to the QA browser.'); process.exitCode = 1; socket.close(); };
