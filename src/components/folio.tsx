"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import "./folio.css";
import "./folio-sections.css";

const projects = [
  {
    slug: "prospects",
    name: "Prospects",
    kind: "Sales operations / Maps / Product design",
    text: "A map of the next opportunity.",
    number: "01",
  },
  {
    slug: "helga",
    name: "Helga",
    kind: "Voice / AI / Interface design",
    text: "A quiet space for a busy day.",
    number: "02",
  },
  {
    slug: "receptionist",
    name: "Receptionist",
    kind: "Voice AI / Customer experience",
    text: "Every conversation, accounted for.",
    number: "03",
  },
  {
    slug: "documents",
    name: "Documents",
    kind: "Automation / AI / PDF",
    text: "From rough notes to ready to share.",
    number: "04",
  },
  {
    slug: "rfp",
    name: "RFP workspace",
    kind: "Research / AI / Document workflows",
    text: "A response grounded in the details.",
    number: "05",
  },
  {
    slug: "cms",
    name: "Content studio",
    kind: "Content / Publishing / Web design",
    text: "A simpler way to put ideas online.",
    number: "06",
  },
];
export default function Folio() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const media = matchMedia("(min-width: 901px)");
    const update = () => {
      if (!root.current || !track.current) return;
      const max = Math.max(0, track.current.scrollWidth - (innerWidth - 64));
      if (media.matches) {
        root.current.style.height = `${max + innerHeight}px`;
        track.current.style.transform = `translate3d(${-Math.min(scrollY, max)}px,0,0)`;
        setProgress(max ? Math.min(scrollY / max, 1) : 0);
      } else {
        root.current.style.height = "";
        track.current.style.transform = "";
        setProgress(
          scrollY /
            Math.max(1, document.documentElement.scrollHeight - innerHeight),
        );
      }
    };
    const observer = new ResizeObserver(update);
    if (track.current) observer.observe(track.current);
    update();
    const initialSection = document.getElementById(location.hash.slice(1));
    if (media.matches && initialSection)
      window.scrollTo(0, initialSection.offsetLeft);
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    media.addEventListener("change", update);
    document.fonts.ready.then(update);
    return () => {
      observer.disconnect();
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      media.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (open) menu.current?.showModal();
    else menu.current?.close();
  }, [open]);
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    e.preventDefault();
    setOpen(false);
    const desktop = matchMedia("(min-width: 901px)").matches;
    window.scrollTo({
      top: desktop
        ? section.offsetLeft
        : section.getBoundingClientRect().top + scrollY - 64,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    history.replaceState(null, "", `#${id}`);
  };
  return (
    <div className="folio" ref={root}>
      <aside className="folio-rail">
        <button
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={30} strokeWidth={1.2} />
        </button>
        <span className="rail-edition">FOLIO — EDITION</span>
        <a href="#home" onClick={(e) => go(e, "home")} className="rail-name">
          JAKE WORSHAM<sup>™</sup>
        </a>
        <span className="rail-year">© 2026</span>
        <div
          className="rail-progress"
          style={{ transform: `scaleY(${progress})` }}
        />
      </aside>
      <header className="folio-mobile-header">
        <a href="#home" onClick={(e) => go(e, "home")}>
          JW<sup>™</sup>
        </a>
        <button aria-label="Open navigation" onClick={() => setOpen(true)}>
          <Menu size={30} strokeWidth={1.2} />
        </button>
      </header>
      <dialog ref={menu} className="folio-menu" onCancel={() => setOpen(false)}>
        <header>
          <span>Jake Worsham / Portfolio</span>
          <button onClick={() => setOpen(false)} aria-label="Close navigation">
            <X size={28} />
          </button>
        </header>
        <nav>
          {[
            ["home", "Home"],
            ["about", "About"],
            ["work", "Works"],
            ["contact", "Contact"],
          ].map(([id, name], i) => (
            <a href={`#${id}`} onClick={(e) => go(e, id)} key={id}>
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
      <div className="folio-stage">
        <div
          className="folio-track"
          ref={track}
          onFocusCapture={(e) => {
            if (!matchMedia("(min-width: 901px)").matches) return;
            const stage = track.current?.parentElement;
            if (stage) stage.scrollLeft = 0;
            const bounds = e.target.getBoundingClientRect();
            if (bounds.left < 64 || bounds.right > innerWidth)
              window.scrollBy({ top: bounds.left - 100, behavior: "instant" });
          }}
        >
          <section
            className="folio-panel folio-hero"
            id="home"
            aria-label="Introduction"
          >
            <h1>
              <span>JAKE</span>
              <span>WORSHAM</span>
            </h1>
            <p className="folio-introduction">
              Designer and software builder based in Michigan — turning everyday
              business problems into considered digital experiences.
            </p>
            <div className="folio-hero-bottom">
              <p>
                Grand Rapids, Michigan
                <br />
                Design & engineering at Sync
              </p>
              <p>
                Open to the
                <br />
                next good challenge
              </p>
              <a href="#about" onClick={(e) => go(e, "about")}>
                SCROLL <ArrowRight size={30} strokeWidth={1} />
              </a>
            </div>
          </section>
          <section
            className="folio-panel folio-about"
            id="about"
            aria-label="About Jake"
          >
            <div className="folio-chapter">CHAPTER I</div>
            <div className="folio-about-content">
              <span className="folio-kicker">QUICK INTRO</span>
              <h2>
                Hi, I’m Jake — I work where product design, code, and real
                business needs meet. I like making complicated work feel simple.
              </h2>
              <div className="folio-about-bottom">
                <p>
                  From the first conversation
                  <br />
                  to the last working detail.
                </p>
                <div
                  className="folio-monogram"
                  aria-label="Jake Worsham monogram"
                >
                  <span>
                    J<span>W</span>
                  </span>
                  <small>DESIGN. BUILD. REPEAT.</small>
                </div>
              </div>
              <a
                className="folio-text-link"
                href="#work"
                onClick={(e) => go(e, "work")}
              >
                Explore the work <ArrowRight size={23} />
              </a>
            </div>
            <p className="folio-about-note">
              Built with curiosity.
              <br />
              Tested by doing.
            </p>
          </section>
          <section
            className="folio-panel folio-work-title"
            id="work"
            aria-label="Selected work"
          >
            <span className="folio-kicker">SELECTED PROJECTS / 01—06</span>
            <h2>
              The
              <br />
              <em>Work</em>
            </h2>
            <div>
              <p>
                Ideas you can actually try.
                <br />
                Open a project. Make something happen.
              </p>
              <ArrowRight size={38} strokeWidth={1} />
            </div>
          </section>
          <section
            className="folio-panel folio-projects"
            aria-label="Working demonstrations"
          >
            <div className="folio-project-heading">
              <span className="folio-chapter">CHAPTER II</span>
              <p>
                RELATED WORK
                <br />
                <small>
                  Six working demonstrations, each with its own point of view.
                </small>
              </p>
            </div>
            <div className="folio-project-grid">
              {projects.map((p) => (
                <a
                  className={`folio-project project-${p.slug}`}
                  href={`/${p.slug}/`}
                  key={p.slug}
                >
                  <div className="folio-project-image">
                    <img
                      src={`/projects/${p.slug}.webp`}
                      alt={`${p.name} interactive application`}
                      loading="lazy"
                      width={1440}
                      height={1000}
                    />
                    <span>
                      Open project <ArrowUpRight size={17} />
                    </span>
                  </div>
                  <div className="folio-project-caption">
                    <small>({p.number})</small>
                    <div>
                      <h3>{p.name}</h3>
                      <p>{p.kind}</p>
                    </div>
                    <ArrowUpRight size={25} strokeWidth={1} />
                  </div>
                </a>
              ))}
            </div>
          </section>
          <section
            className="folio-panel folio-practice"
            id="approach"
            aria-label="How I work"
          >
            <span className="folio-chapter">CHAPTER III</span>
            <div>
              <span className="folio-kicker">WHAT I DO</span>
              <h2>
                A thought.
                <br />A conversation.
                <br />
                <em>A working thing.</em>
              </h2>
              <div className="folio-services">
                {[
                  [
                    "01",
                    "Understand",
                    "Find the work behind the request. Talk to the people doing it.",
                  ],
                  [
                    "02",
                    "Design",
                    "Give the workflow a clear shape and the interface a considered feel.",
                  ],
                  [
                    "03",
                    "Build",
                    "Connect the experience to real data, useful automation, and reliable services.",
                  ],
                  [
                    "04",
                    "Refine",
                    "Try the whole journey. Notice what gets in the way. Make it better.",
                  ],
                ].map(([n, title, text]) => (
                  <article key={n}>
                    <small>{n}</small>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
          <section
            className="folio-panel folio-contact"
            id="contact"
            aria-label="Contact"
          >
            <div className="folio-contact-top">
              <span>WHERE IDEAS BECOME USEFUL</span>
              <p>
                Have a role, project, or
                <br />
                interesting problem in mind?
              </p>
            </div>
            <a href="mailto:jake@syncgr.com" className="folio-next">
              Next
              <br />
              <em>chapter</em>
              <ArrowUpRight strokeWidth={0.7} />
            </a>
            <div className="folio-contact-bottom">
              <a href="mailto:jake@syncgr.com">
                jake@syncgr.com <ArrowUpRight size={18} />
              </a>
              <nav aria-label="Social links">
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
              </nav>
              <span>
                © 2026 Jake Worsham
                <br />
                Folio — Edition
              </span>
            </div>
          </section>
        </div>
      </div>
      <span className="folio-scroll-hint" aria-hidden="true">
        <ArrowDown size={12} /> Scroll to explore
      </span>
    </div>
  );
}
