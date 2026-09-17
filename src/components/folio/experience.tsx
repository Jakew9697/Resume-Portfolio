"use client";
import { useEffect, useRef, useState } from "react";
import { HomeContent, ContactSection } from "./home";
import { AboutContent } from "./about";
import { Works } from "./works";
import { Journey } from "./journey";
import "./shell.css";
import "./home.css";
import "./about.css";
import "./works.css";

export default function FolioExperience({
  page = "home",
  projectSlug,
}: {
  page?: "home" | "about" | "works" | "contact";
  projectSlug?: string;
}) {
  const menu = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) menu.current?.showModal();
    else menu.current?.close();
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    // Existing published chapter links retain a meaningful destination.
    if (
      page === "home" &&
      ["#about", "#approach", "#work"].includes(location.hash)
    )
      location.replace(location.hash === "#work" ? "/works/" : "/about/");
  }, [page]);
  return (
    <div
      className="folio-site"
      data-menu-open={open}
      data-theme={page === "home" || page === "contact" ? "warm" : "paper"}
    >
      <link
        rel="preload"
        href="/fonts/pp-editorial-old-light.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/pp-neue-montreal-regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <header className="folio-rail">
        <a className="folio-mobile-logo" href="/" aria-label="Back to home">
          JW<sup>™</sup>
        </a>
        <button
          className="folio-menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="folio-menu"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="folio-edition">FOLIO — EDITION</span>
        <a className="folio-rail-name" href="/" aria-label="Back to home">
          JAKE WORSHAM<sup>™</sup>
        </a>
        <span className="folio-year">© 2026</span>
        <span className="folio-progress" />
      </header>
      <dialog
        id="folio-menu"
        className="folio-menu"
        ref={menu}
        onCancel={() => setOpen(false)}
      >
        <a className="folio-menu-brand" href="/" aria-label="Back to home">
          JW<sup>™</sup>
        </a>
        <button
          className="folio-menu-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <span>CLOSE</span>
        </button>
        <nav aria-label="Portfolio pages">
          {[
            ["/", "Home"],
            ["/about/", "About"],
            ["/works/", "Works"],
            ["mailto:jake@syncgr.com", "Contact"],
          ].map(([href, label], index) => (
            <a
              key={href}
              href={href}
              aria-current={
                page ===
                (index === 0
                  ? "home"
                  : index === 1
                    ? "about"
                    : index === 2
                      ? "works"
                      : "contact")
                  ? "page"
                  : undefined
              }
              onClick={() => {
                if (href.startsWith("mailto:")) setOpen(false);
              }}
            >
              <span className="folio-menu-number">0{index + 1}.</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="folio-menu-social">
          <a
            href="https://github.com/Jakew9697"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/jakeworsham"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:jake@syncgr.com">Email</a>
        </div>
      </dialog>
      <main>
        {page === "works" ? (
          <Works initialSlug={projectSlug} />
        ) : (
          <Journey page={page}>
            {page === "home" ? (
              <HomeContent />
            ) : page === "about" ? (
              <AboutContent />
            ) : (
              <ContactSection />
            )}
          </Journey>
        )}
      </main>
    </div>
  );
}
