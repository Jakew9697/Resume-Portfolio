import type { WorkspaceData } from '@/lib/demo-data';
import { ArrowUpRight } from 'lucide-react';
export function SitePreview({ page }: { page: WorkspaceData<'cms'>['draft'] }) {
  return <article className={`sample-site accent-${page.accent}`}><header><strong>{page.brand}</strong><span>A place for possibility.</span></header><div className="sample-site-body"><div><span className="sample-site-kicker">Space for your next chapter</span><h1>{page.headline}</h1><p>{page.description}</p><a href={`mailto:${page.email}`}>{page.button}<ArrowUpRight size={19}/></a></div><div className="architecture-art" aria-label="Abstract architectural illustration" role="img"><div className="arch arch-back"/><div className="arch arch-front"/><div className="arch-shadow"/><span className="art-caption">Room to think.<br/>Room to make.</span></div></div><footer><span>{page.brand}</span><span>Independent work. Shared possibilities.</span></footer></article>;
}
