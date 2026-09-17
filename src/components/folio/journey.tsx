"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function Journey({
  page,
  children,
}: {
  page: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    const row = track.current;
    const shell = element?.closest<HTMLElement>(".folio-site");
    if (!element || !row || !shell) return;
    const desktop = matchMedia("(min-width: 768px)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let max = 0,
      pauseAt = 0,
      pauseLength = 0,
      displayed = 0,
      frame = 0;
    const sections = [...row.querySelectorAll<HTMLElement>(":scope > section")];
    const pause = row.querySelector<HTMLElement>("[data-scroll-pause]");
    const paint = () => {
      const target = Math.min(Math.max(0, scrollY), max);
      displayed =
        reduce.matches || !desktop.matches
          ? target
          : displayed + (target - displayed) * 0.16;
      if (Math.abs(target - displayed) < 0.1) displayed = target;
      const x =
        displayed <= pauseAt
          ? displayed
          : displayed < pauseAt + pauseLength
            ? pauseAt
            : displayed - pauseLength;
      row.style.transform = desktop.matches ? `translate3d(${-x}px,0,0)` : "";
      if (pause)
        pause.style.setProperty(
          "--interlude",
          String(
            Math.max(
              0,
              Math.min(1, (displayed - pauseAt) / Math.max(1, pauseLength)),
            ),
          ),
        );
      const current = desktop.matches
        ? sections.find(
            (section) =>
              section.offsetLeft <= x + 65 &&
              section.offsetLeft + section.offsetWidth > x + 65,
          )
        : sections.find((section) => {
            const bounds = section.getBoundingClientRect();
            return bounds.top <= 66 && bounds.bottom > 66;
          });
      shell.dataset.theme =
        current?.dataset.theme || sections[0]?.dataset.theme || "paper";
      shell.style.setProperty("--progress", String(target / Math.max(1, max)));
      frame = displayed === target ? 0 : requestAnimationFrame(paint);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const measure = () => {
      pauseAt = pause?.offsetLeft ?? Infinity;
      pauseLength = pause && desktop.matches ? innerHeight : 0;
      max = desktop.matches
        ? Math.max(0, row.scrollWidth - innerWidth + pauseLength)
        : Math.max(0, element.scrollHeight - innerHeight);
      element.style.height = desktop.matches ? `${max + innerHeight}px` : "";
      schedule();
    };
    const navigateToHash = () => {
      const id = location.hash.slice(1);
      const section = sections.find((item) => item.id === id);
      if (!section) return;
      const top = desktop.matches
        ? section.offsetLeft + (section.offsetLeft > pauseAt ? pauseLength : 0)
        : section.offsetTop - 65;
      window.scrollTo({ top, behavior: "instant" });
      displayed = top;
      schedule();
    };
    const remember = () => {
      try {
        sessionStorage.setItem(`folio:scroll:${page}`, String(scrollY));
      } catch {
        /* Optional position memory. */
      }
    };
    const wheel = (event: WheelEvent) => {
      if (
        desktop.matches &&
        Math.abs(event.deltaX) > Math.abs(event.deltaY) &&
        !document.querySelector(".folio-menu[open]")
      ) {
        event.preventDefault();
        window.scrollBy(0, event.deltaX);
      }
    };
    measure();
    try {
      displayed = Number(sessionStorage.getItem(`folio:scroll:${page}`)) || 0;
      window.scrollTo(0, displayed);
    } catch {
      /* Start at the first section. */
    }
    navigateToHash();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            (entry.target as HTMLElement).dataset.visible = "true";
        }),
      { threshold: 0.08 },
    );
    row
      .querySelectorAll("[data-reveal]")
      .forEach((item) => reveal.observe(item));
    document.fonts.ready.then(measure);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", measure);
    addEventListener("hashchange", navigateToHash);
    addEventListener("pagehide", remember);
    addEventListener("wheel", wheel, { passive: false });
    desktop.addEventListener("change", measure);
    reduce.addEventListener("change", schedule);
    return () => {
      remember();
      cancelAnimationFrame(frame);
      observer.disconnect();
      reveal.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", measure);
      removeEventListener("hashchange", navigateToHash);
      removeEventListener("pagehide", remember);
      removeEventListener("wheel", wheel);
      desktop.removeEventListener("change", measure);
      reduce.removeEventListener("change", schedule);
    };
  }, [page]);
  return (
    <div ref={root} className="folio-journey" data-page={page}>
      <div className="folio-pinned">
        <div
          ref={track}
          className="folio-journey-track"
          onFocusCapture={(event) => {
            if (!matchMedia("(min-width: 768px)").matches) return;
            if (track.current?.parentElement)
              track.current.parentElement.scrollLeft = 0;
            const bounds = event.target.getBoundingClientRect();
            const section = event.target.closest<HTMLElement>(".folio-panel");
            const pause = track.current?.querySelector<HTMLElement>(
              "[data-scroll-pause]",
            );
            if (section && (bounds.left < 64 || bounds.right > innerWidth))
              window.scrollTo({
                top:
                  section.offsetLeft +
                  (pause && section.offsetLeft > pause.offsetLeft
                    ? innerHeight
                    : 0),
                behavior: "instant",
              });
          }}
          onKeyDown={(event) => {
            if (
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              !matchMedia("(min-width: 768px)").matches
            )
              return;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              window.scrollBy({
                top: innerWidth * (event.key === "ArrowRight" ? 1 : -1),
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              });
            }
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
