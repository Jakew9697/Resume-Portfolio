'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { api, request, errorText } from '@/lib/api';
export function useSpeech() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const url = useRef('');
  const stop = () => { audio.current?.pause(); setSpeaking(false); if (url.current) URL.revokeObjectURL(url.current); };
  useEffect(() => () => { audio.current?.pause(); if (url.current) URL.revokeObjectURL(url.current); }, []);
  const speak = async (text: string, voice = 'Joanna') => {
    stop();
    const response = await request('/voice/speak', { text: text.slice(0,2500), voice });
    url.current = URL.createObjectURL(await response.blob());
    const player = new Audio(url.current); audio.current = player;
    player.onended = stop; player.onerror = stop;
    await player.play(); setSpeaking(true);
  };
  return { speaking, speak, stop };
}
export function ListenButton({ text, voice, onError }: { text: string; voice?: string; onError: (error: string) => void }) {
  const speech = useSpeech(); const [loading, setLoading] = useState(false);
  return <button className="secondary small-button" disabled={loading} onClick={() => { if (speech.speaking) speech.stop(); else { setLoading(true); void speech.speak(text,voice).catch(e => onError(errorText(e))).finally(() => setLoading(false)); } }}>{speech.speaking ? <Square size={14}/> : <Volume2 size={15}/>} {loading ? 'Preparing audio…' : speech.speaking ? 'Stop audio' : 'Listen'}</button>;
}
export function RecordButton({ onText, onError, disabled = false, onState }: { onText: (text: string) => void; onError: (message: string) => void; disabled?: boolean; onState?: (state: string) => void }) {
  const recorder = useRef<MediaRecorder | null>(null); const stream = useRef<MediaStream | null>(null); const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true); const [state, setState] = useState('idle');
  const update = (s: string) => { if (alive.current) { setState(s); onState?.(s); } };
  useEffect(() => { alive.current = true; return () => { alive.current = false; if (timer.current) clearTimeout(timer.current); if (recorder.current?.state === 'recording') recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()); }; }, []);
  const start = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error('Microphone recording is unavailable in this browser. Type a message below.');
      update('opening');
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/mp4';
      const chunks: BlobPart[] = [];
      const rec = new MediaRecorder(stream.current, { mimeType, audioBitsPerSecond: 64000 }); recorder.current = rec;
      rec.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      rec.onstop = () => {
        if (timer.current) clearTimeout(timer.current);
        stream.current?.getTracks().forEach(t => t.stop());
        if (!alive.current) return;
        update('transcribing');
        void (async () => {
          const blob = new Blob(chunks, { type: mimeType });
          const base64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(blob); });
          const job = await api<{ id: string }>('/voice/transcribe', { audio: base64, format: mimeType.includes('webm') ? 'webm' : 'mp4' });
          for (let i = 0; i < 60 && alive.current; i++) {
            await new Promise(resolve => setTimeout(resolve,1500));
            const result = await api<{ status: string; text?: string }>(`/voice/transcribe/${job.id}`);
            if (result.status === 'complete') { if (!result.text?.trim()) throw new Error('No speech detected. Try again or type your message.'); onText(result.text); return; }
          }
          if (alive.current) throw new Error('Transcription took too long. Please try again.');
        })().catch(e => { if (alive.current) onError(errorText(e)); }).finally(() => update('idle'));
      };
      rec.start(); update('recording'); timer.current = setTimeout(() => rec.stop(),30000);
    } catch (e) { stream.current?.getTracks().forEach(t => t.stop()); update('idle'); onError(errorText(e)); }
  };
  return <button className={`secondary record-button ${state === 'recording' ? 'recording' : ''}`} disabled={disabled || ['opening','transcribing'].includes(state)} onClick={() => state === 'recording' ? recorder.current?.stop() : void start()} aria-label={state === 'recording' ? 'Stop recording' : 'Record a voice message'}>{state === 'recording' ? <Square size={17}/> : <Mic size={18}/>}<span>{state === 'recording' ? 'Stop recording' : state === 'transcribing' ? 'Transcribing…' : state === 'opening' ? 'Opening mic…' : 'Use microphone'}</span></button>;
}
