"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type FolioSlide = {
  id: string;
  title: string;
  className: string;
  content: ReactNode;
};

export function FolioCarousel({
  id,
  label,
  active,
  slides,
}: {
  id: string;
  label: string;
  active: boolean;
  slides: FolioSlide[];
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const destination = useRef<number | null>(null);
  const initialized = useRef(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const node = viewport.current;
    if (!node || !active) return;
    if (!initialized.current) {
      try {
        const saved = Number(sessionStorage.getItem(`folio:${id}:slide`));
        if (Number.isInteger(saved) && saved >= 0 && saved < slides.length) {
          position.current = saved;
          setIndex(saved);
        }
      } catch {
        /* Browsing still works when storage is unavailable. */
      }
      initialized.current = true;
    }
    destination.current = null;
    // Hidden pages retain their own position, including after a viewport resize.
    const restore = () =>
      node.scrollTo({
        left: position.current * node.clientWidth,
        behavior: "instant",
      });
    restore();
    const observer = new ResizeObserver(restore);
    observer.observe(node);
    const settled = () => {
      destination.current = null;
    };
    const interrupted = () => {
      destination.current = null;
    };
    node.addEventListener("scrollend", settled);
    node.addEventListener("pointerdown", interrupted);
    node.addEventListener("wheel", interrupted, { passive: true });
    return () => {
      observer.disconnect();
      node.removeEventListener("scrollend", settled);
      node.removeEventListener("pointerdown", interrupted);
      node.removeEventListener("wheel", interrupted);
    };
  }, [active, id, slides.length]);

  const move = (next: number) => {
    const node = viewport.current;
    if (!node) return;
    const target = Math.max(0, Math.min(slides.length - 1, next));
    destination.current = target;
    if (document.activeElement?.closest(".folio-slide"))
      node.focus({ preventScroll: true });
    node.scrollTo({
      left: target * node.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <section
      id={id}
      className="folio-carousel"
      hidden={!active}
      aria-label={`${label} content`}
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
          return;
        const current = destination.current ?? position.current;
        const target = {
          ArrowLeft: current - 1,
          ArrowRight: current + 1,
          Home: 0,
          End: slides.length - 1,
        }[event.key];
        if (target !== undefined) {
          event.preventDefault();
          move(target);
        }
      }}
    >
      <div
        ref={viewport}
        className="folio-carousel-track"
        tabIndex={0}
        aria-label={`${label} slides`}
        aria-describedby={`${id}-instructions`}
        onScroll={(event) => {
          const node = event.currentTarget;
          if (!active || !node.clientWidth) return;
          const next = Math.max(
            0,
            Math.min(
              slides.length - 1,
              Math.round(node.scrollLeft / node.clientWidth),
            ),
          );
          position.current = next;
          setIndex(next);
          try {
            sessionStorage.setItem(`folio:${id}:slide`, String(next));
          } catch {
            /* Optional position memory. */
          }
        }}
      >
        {slides.map((slide, i) => (
          <article
            key={slide.id}
            className={`folio-slide ${slide.className}`}
            data-slide={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
            aria-hidden={index !== i}
            inert={index !== i}
          >
            {slide.content}
          </article>
        ))}
      </div>
      <footer className="folio-carousel-controls">
        <span className="folio-slide-name">{slides[index].title}</span>
        <div className="folio-carousel-navigation">
          <span className="folio-slide-count" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
            <span> / {String(slides.length).padStart(2, "0")}</span>
          </span>
          <button
            aria-label={`Previous ${label.toLowerCase()} slide`}
            disabled={index === 0}
            onClick={() => move((destination.current ?? position.current) - 1)}
          >
            <ArrowLeft size={23} strokeWidth={1.3} />
          </button>
          <button
            aria-label={`Next ${label.toLowerCase()} slide`}
            disabled={index === slides.length - 1}
            onClick={() => move((destination.current ?? position.current) + 1)}
          >
            <ArrowRight size={23} strokeWidth={1.3} />
          </button>
        </div>
      </footer>
      <p className="sr-only" id={`${id}-instructions`}>
        Swipe horizontally or use the previous and next buttons. With this
        carousel focused, use the left and right arrow keys, Home, or End.
      </p>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {active
          ? `${label}: ${slides[index].title}, slide ${index + 1} of ${slides.length}`
          : ""}
      </span>
    </section>
  );
}
