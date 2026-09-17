"use client";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { projects } from "./projects";

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Detroit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span>
      Grand Rapids, Michigan
      <br />
      {time ? `(ET) ${time}` : "Eastern Time"}
    </span>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="folio-panel folio-contact"
      data-theme="night"
      aria-label="Contact"
    >
      <h2 className="folio-display" data-reveal>
        NEXT
        <br />
        CHAPTER
      </h2>
      <nav className="folio-footer-social" aria-label="Social">
        <a href="https://github.com/Jakew9697" target="_blank" rel="noreferrer">
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
      <div className="folio-email-block">
        <span className="folio-eyebrow">Contact to</span>
        <a href="mailto:jake@syncgr.com">jake@syncgr.com</a>
      </div>
      <p className="folio-footer-note">Where ideas become useful</p>
      <div className="folio-mobile-copyright">
        <span>© 2026 — Jake Worsham</span>
        <span>Folio — edition</span>
      </div>
    </section>
  );
}

export function HomeContent() {
  const [preview, setPreview] = useState<string | null>(null);
  const [experience, setExperience] = useState("Sync");
  return (
    <>
      <section
        className="folio-panel folio-hero"
        data-theme="warm"
        aria-label="Introduction"
      >
        <h1 className="folio-display" data-reveal>
          JAKE
          <br />
          WORSHAM
        </h1>
        <p className="folio-hero-description">
          Designer and software engineer based in Michigan — building thoughtful
          digital experiences that work.
        </p>
        <div className="folio-hero-location">
          <LocalTime />
        </div>
        <p className="folio-hero-availability">
          Open for
          <br />
          the next good challenge
        </p>
        <a
          href="#intro"
          className="folio-scroll-word"
          onClick={(event) => {
            event.preventDefault();
            location.hash = "intro";
          }}
        >
          SCROLL
        </a>
      </section>
      <section
        id="intro"
        className="folio-panel folio-intro"
        data-theme="paper"
        aria-label="About Jake"
      >
        <span className="folio-chapter">CHAPTER I</span>
        <div className="folio-intro-copy" data-reveal>
          <span className="folio-eyebrow">Quick intro</span>
          <p>
            Hi, I’m Jake — a software engineer at Sync since 2023. I work across
            product design, code, and real business needs to make complicated
            work feel simple.
          </p>
        </div>
        <p className="folio-intro-note">
          Built with curiosity.
          <br />
          Tested by doing.
        </p>
        <p className="folio-intro-quote">
          FROM THE FIRST CONVERSATION.
          <br />
          TO THE LAST WORKING DETAIL.
        </p>
        <img
          className="folio-intro-portrait"
          src="/jake-worsham.jpg"
          alt="Jake Worsham"
          width={460}
          height={460}
        />
        <a className="folio-intro-link folio-inline-link" href="/about/">
          More about me <ArrowRight size={23} />
        </a>
      </section>
      <section
        className="folio-panel folio-work-interlude"
        data-theme="paper"
        data-scroll-pause
        aria-label="The work"
      >
        <div className="folio-work-words">
          <span>THE</span>
          <span>WORK</span>
        </div>
        <div className="folio-mosaic" aria-hidden="true">
          {projects.map((project) => (
            <img
              key={project.slug}
              src={`/projects/${project.slug}.webp`}
              alt=""
              width={1440}
              height={1000}
              loading="lazy"
            />
          ))}
        </div>
      </section>
      <section
        className="folio-panel folio-selected"
        data-theme="stone"
        aria-label="Selected work"
      >
        <span className="folio-chapter">CHAPTER II</span>
        <div className="folio-selected-list">
          <span className="folio-eyebrow">Related work</span>
          {projects.slice(0, 4).map((project) => (
            <a
              key={project.slug}
              href={`/works/${project.slug}/`}
              onMouseEnter={() => setPreview(project.slug)}
              onMouseLeave={() => setPreview(null)}
              onFocus={() => setPreview(project.slug)}
              onBlur={() => setPreview(null)}
            >
              {project.name}
              <ArrowRight size={32} />
            </a>
          ))}
        </div>
        <div className="folio-hover-preview" data-active={!!preview}>
          {projects.slice(0, 4).map((project) => (
            <img
              key={project.slug}
              src={`/projects/${project.slug}.webp`}
              alt=""
              width={1440}
              height={1000}
              loading="lazy"
              style={{ opacity: preview === project.slug ? 1 : 0 }}
            />
          ))}
        </div>
        <p className="folio-selected-note">
          ❋ Working demonstrations.
          <br />
          Open a project and try the whole journey.
        </p>
        <a className="folio-all-work folio-inline-link" href="/works/">
          View All Work <ArrowRight size={23} />
        </a>
      </section>
      <section
        className="folio-panel folio-services"
        data-theme="ink"
        aria-label="What I do"
      >
        <div className="folio-service-intro">
          <span className="folio-chapter">CHAPTER III</span>
          <div>
            <span className="folio-eyebrow">What I do</span>
            <p>
              Designing and building useful software,
              <br />
              from the interface to the infrastructure.
            </p>
          </div>
        </div>
        {[
          [
            "Product design",
            "Clear interfaces shaped around the people doing the work.",
            "prospects",
          ],
          [
            "AI & voice",
            "Assistants that turn conversations into useful actions.",
            "helga",
          ],
          [
            "Automation",
            "Document and content workflows that carry an idea through to completion.",
            "documents",
          ],
          [
            "Development",
            "Working experiences connected to real data and reliable AWS services.",
            "cms",
          ],
        ].map(([title, text, slug], index) => (
          <article className={`folio-service service-${index}`} key={title}>
            <img
              src={`/projects/${slug}.webp`}
              alt=""
              width={1440}
              height={1000}
              loading="lazy"
            />
            <span className="folio-service-number">0{index + 1}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section
        className="folio-panel folio-experience"
        data-theme="stone"
        aria-label="Selected experience"
      >
        <span className="folio-chapter">CHAPTER IV</span>
        <div className="folio-experience-list">
          <span className="folio-eyebrow">Selected experience</span>
          {[
            "Sync",
            "AI & voice",
            "Sales systems",
            "Document workflows",
            "Content publishing",
          ].map((name) => (
            <button
              key={name}
              onMouseEnter={() => setExperience(name)}
              onFocus={() => setExperience(name)}
              onClick={() => setExperience(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="folio-experience-word" aria-live="polite">
          {experience}
        </div>
        <p className="folio-experience-more">And more</p>
        <p className="folio-experience-note">
          Work spanning interfaces, automation,
          <br />
          and the systems behind them.
        </p>
      </section>
      <ContactSection />
    </>
  );
}
