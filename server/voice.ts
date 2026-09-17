import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';
import { HTTPException } from 'hono/http-exception';
import { randomUUID } from 'node:crypto';
const s3 = new S3Client({});
const transcribe = new TranscribeClient({});
const bucket = process.env.AUDIO_BUCKET!;
export async function speak(text: string, voice: 'Joanna' | 'Matthew') {
  const result = await new PollyClient({}).send(new SynthesizeSpeechCommand({ Text: text, TextType: 'text', VoiceId: voice, Engine: 'neural', OutputFormat: 'mp3' }));
  if (!result.AudioStream) throw new Error('Empty speech response');
  return Buffer.from(await result.AudioStream.transformToByteArray());
}
export async function startTranscription(session: string, audio: string, format: 'webm' | 'mp4' | 'wav') {
  const bytes = Buffer.from(audio, 'base64');
  if (!bytes.length || bytes.length > 2500000) throw new HTTPException(400, { message: 'Record a short message, up to 30 seconds.' });
  const id = `jake-${session}-${randomUUID()}`;
  const key = `audio/${session}/${id}.${format}`;
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes, ContentType: `audio/${format}` }));
  await transcribe.send(new StartTranscriptionJobCommand({ TranscriptionJobName: id, LanguageCode: 'en-US', MediaFormat: format, Media: { MediaFileUri: `s3://${bucket}/${key}` }, OutputBucketName: bucket, OutputKey: `transcripts/${session}/${id}.json` }));
  return { id };
}
export async function transcription(session: string, id: string) {
  if (!id.startsWith(`jake-${session}-`) || !/^jake-[a-f0-9-]{73}$/.test(id)) throw new HTTPException(404, { message: 'Recording not found.' });
  const { TranscriptionJob } = await transcribe.send(new GetTranscriptionJobCommand({ TranscriptionJobName: id }));
  if (TranscriptionJob?.TranscriptionJobStatus === 'FAILED') throw new HTTPException(422, { message: 'Could not transcribe this recording. Try a quieter recording or type your message.' });
  if (TranscriptionJob?.TranscriptionJobStatus !== 'COMPLETED') return { status: 'processing' };
  const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: `transcripts/${session}/${id}.json` }));
  const content = JSON.parse(await Body!.transformToString());
  return { status: 'complete', text: String(content.results?.transcripts?.[0]?.transcript || '').slice(0, 4000) };
}
