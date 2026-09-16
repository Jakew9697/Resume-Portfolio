"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { FolioCarousel } from "./folio-carousel";
import { createFolioContent, pages, type FolioPage } from "./folio-content";
import "./folio.css";
import "./folio-sections.css";

export default function Folio() {
  const menu = useRef<HTMLDialogElement>(null);
  const [page, setPage] = useState<FolioPage>("home");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const readHash = () => {
      const hash = location.hash.slice(1);
      setPage(
        hash === "approach"
          ? "about"
          : pages.some(([id]) => id === hash)
            ? (hash as FolioPage)
            : "home",
      );
    };
    readHash();
    addEventListener("hashchange", readHash);
    addEventListener("popstate", readHash);
    return () => {
      removeEventListener("hashchange", readHash);
      removeEventListener("popstate", readHash);
    };
  }, []);
  useEffect(() => {
    if (open) menu.current?.showModal();
    else menu.current?.close();
  }, [open]);
  const go = (e: MouseEvent<HTMLAnchorElement>, id: FolioPage) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setOpen(false);
    if (page !== id) history.pushState(null, "", `#${id}`);
    setPage(id);
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>(`#${id} .folio-carousel-track`)
        ?.focus({ preventScroll: true }),
    );
  };
  const content = createFolioContent(go);
  return (
    <div className={`folio folio-page-${page}`}>
      <aside className="folio-rail">
        <button
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="folio-menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={30} strokeWidth={1.2} />
        </button>
        <span className="rail-edition">FOLIO — EDITION</span>
        <a href="#home" onClick={(e) => go(e, "home")} className="rail-name">
          JAKE WORSHAM<sup>™</sup>
        </a>
        <span className="rail-year">© 2026</span>
      </aside>
      <header className="folio-header">
        <a
          href="#home"
          className="folio-mobile-wordmark"
          onClick={(e) => go(e, "home")}
        >
          JW<sup>™</sup>
        </a>
        <span className="folio-page-label">
          Jake Worsham / {pages.find(([id]) => id === page)?.[1]}
        </span>
        <nav aria-label="Portfolio pages">
          {pages.map(([id, name]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => go(e, id)}
              aria-current={page === id ? "page" : undefined}
            >
              {name}
            </a>
          ))}
        </nav>
        <button
          className="folio-mobile-menu"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="folio-menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={28} strokeWidth={1.2} />
        </button>
      </header>
      <dialog
        ref={menu}
        id="folio-menu"
        className="folio-menu"
        onCancel={() => setOpen(false)}
      >
        <header>
          <span>Jake Worsham / Portfolio</span>
          <button onClick={() => setOpen(false)} aria-label="Close navigation">
            <X size={28} />
          </button>
        </header>
        <nav aria-label="Full navigation">
          {pages.map(([id, name], i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => go(e, id)}
              aria-current={page === id ? "page" : undefined}
            >
              <small>0{i + 1}.</small>
              {name}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
        <footer>
          <a
            href="https://github.com/Jakew9697"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/jakeworsham"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
          <a href="mailto:jake@syncgr.com">Email ↗</a>
        </footer>
      </dialog>
      <main className="folio-stage">
        {pages.map(([id, name]) => (
          <FolioCarousel
            key={id}
            id={id}
            label={name}
            active={page === id}
            slides={content[id]}
          />
        ))}
      </main>
    </div>
  );
}
