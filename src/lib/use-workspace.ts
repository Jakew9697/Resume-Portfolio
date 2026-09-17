'use client';
import { useCallback, useEffect, useState } from 'react';
import { api, errorText } from './api';
import type { Workspace, WorkspaceData } from './demo-data';
export type Snapshot<K extends Workspace> = { data: WorkspaceData<K>; revision: number };
export function useWorkspace<K extends Workspace>(name: K) {
  const [snapshot, setSnapshot] = useState<Snapshot<K> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const reload = useCallback(async () => {
    setError('');
    try { setSnapshot(await api<Snapshot<K>>(`/state/${name}`)); } catch (e) { setError(errorText(e)); }
  }, [name]);
  useEffect(() => { void reload(); }, [reload]);
  const run = async <T,>(fn: () => Promise<T>, success = ''): Promise<T | undefined> => {
    setBusy(true); setError(''); setNotice('');
    try { const result = await fn(); setNotice(success); return result; }
    catch (e) { setError(errorText(e)); return undefined; }
    finally { setBusy(false); }
  };
  const save = async (data: WorkspaceData<K>, success = 'Changes saved') => run(async () => {
    const result = await api<Snapshot<K>>(`/state/${name}`, { data, revision: snapshot?.revision || 0 }, 'PUT');
    setSnapshot(result); return result;
  }, success);
  return { data: snapshot?.data, snapshot, setSnapshot, busy, error, setError, notice, setNotice, reload, save, run };
}
