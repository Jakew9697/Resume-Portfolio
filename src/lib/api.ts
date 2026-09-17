'use client';
const origin = process.env.NEXT_PUBLIC_DEMO_API?.replace(/\/$/, '') || '';
let pendingSession: Promise<string> | undefined;
async function token(): Promise<string> {
  const raw = sessionStorage.getItem('jake-demo-session');
  if (raw) {
    try { const data = JSON.parse(raw); if (data.expiresAt > Date.now() + 60000) return data.token; } catch { sessionStorage.removeItem('jake-demo-session'); }
  }
  if (!pendingSession) pendingSession = (async () => {
    if (!origin) throw new Error('The demo service is not configured. Please try the live portfolio.');
    const response = await fetch(`${origin}/session`, { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not start your demo workspace.');
    sessionStorage.setItem('jake-demo-session', JSON.stringify(data));
    return data.token as string;
  })().finally(() => { pendingSession = undefined; });
  return pendingSession;
}
export async function request(path: string, body?: unknown, method?: string, signal?: AbortSignal): Promise<Response> {
  const response = await fetch(`${origin}${path}`, { method: method || (body === undefined ? 'GET' : 'POST'), headers: { Authorization: `Bearer ${await token()}`, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, body: body === undefined ? undefined : JSON.stringify(body), signal });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 401) sessionStorage.removeItem('jake-demo-session');
    throw new Error(error.error || `Request failed (${response.status}). Please try again.`);
  }
  return response;
}
export async function api<T>(path: string, body?: unknown, method?: string): Promise<T> { return (await request(path, body, method)).json(); }
export const errorText = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';
