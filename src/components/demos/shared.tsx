'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, BriefcaseBusiness, Check, FileText, Headphones, LayoutTemplate, Menu, Mic, PanelLeftClose, Sparkles, X } from 'lucide-react';
export const demoLinks = [
  { name: 'Prospects', href: '/prospects/', icon: BriefcaseBusiness }, { name: 'Helga', href: '/helga/', icon: Mic },
  { name: 'Receptionist', href: '/receptionist/', icon: Headphones }, { name: 'Documents', href: '/documents/', icon: FileText },
  { name: 'RFP workspace', href: '/rfp/', icon: Sparkles }, { name: 'Content studio', href: '/cms/', icon: LayoutTemplate },
];
export function DemoShell({ active, children, helga = false }: { active: string; children: ReactNode; helga?: boolean }) {
  const [open, setOpen] = useState(false);
  return <div className={`demo-shell ${helga ? 'helga-theme' : 'portal-theme'} ${open ? 'nav-open' : ''}`}>
    <aside className="demo-sidebar"><a className="demo-wordmark" href="/">{helga ? 'helga' : 'workspace'}<span>.</span></a>
      <div className="sidebar-caption">Jake’s working portfolio</div><nav aria-label="Project navigation">{demoLinks.map(item => <a onClick={() => setOpen(false)} aria-current={active === item.name ? 'page' : undefined} className={active === item.name ? 'active' : ''} key={item.href} href={item.href}><item.icon size={18} />{item.name}</a>)}</nav>
      <div className="sidebar-bottom"><div className="visitor-avatar">V</div><div>Visitor workspace<small>Sample data · yours to explore</small></div></div>
      <a className="back-link" href="/"><ArrowLeft size={16} /> Back to portfolio</a>
    </aside>
    <div className="demo-main"><header className="demo-topbar"><button className="icon-button mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <PanelLeftClose size={20}/> : <Menu size={20}/>}</button><span>Portfolio <span className="slash">/</span> <strong>{active}</strong></span><span className="demo-live"><span/>Interactive demo</span></header>
      <main className="demo-content">{children}</main><footer className="demo-footer">A separate demo workspace. Changes are saved for 24 hours. Use sample information.</footer>
    </div>
  </div>;
}
export function Feedback({ error, notice }: { error: string; notice: string }) { return <>{error && <div className="feedback error" role="alert">{error}</div>}{notice && <div className="feedback success" role="status"><Check size={16}/>{notice}</div>}</>; }
export function Loading({ error, retry }: { error: string; retry: () => void }) { return <div className="loading-workspace">{error ? <><p role="alert">{error}</p><button className="primary" onClick={retry}>Try again</button></> : <><div className="loading-line"/><div className="loading-line"/><p>Opening your workspace…</p></>}</div>; }
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const node = dialog.current; node?.showModal(); return () => node?.close(); }, []);
  return <dialog className="demo-modal" ref={dialog} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="modal-title"><div className="modal-inner"><header><h2 id="modal-title">{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></header>{children}</div></dialog>;
}
export function PageTitle({ title, description, children }: { title: string; description: string; children?: ReactNode }) { return <div className="page-title"><div><h1>{title}</h1><p>{description}</p></div><div className="title-actions">{children}</div></div>; }
