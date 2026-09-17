'use client';

import { useWorkspace } from '@/lib/use-workspace';
import { Loading } from '@/components/demos/shared';
import { SitePreview } from '@/components/demos/site-preview';
export default function Published() { const work = useWorkspace('cms'); return <div className="published-demo"><div className="published-banner"><a href="/cms/">← Back to content studio</a><span>Your published demo · version {work.data?.revision || '…'}</span></div>{work.data?.published ? <SitePreview page={work.data.published}/> : <Loading error={work.error} retry={work.reload}/>}</div>; }
