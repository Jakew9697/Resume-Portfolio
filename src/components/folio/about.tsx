import { ArrowRight } from "lucide-react";
export function AboutContent() {
  return (
    <>
      <section
        className="folio-panel folio-about-portrait"
        data-theme="paper"
        aria-label="About Jake — Portrait"
      >
        <img
          src="/jake-worsham.jpg"
          alt="Jake Worsham"
          width={460}
          height={460}
        />
        <div className="folio-about-title">
          <h1 data-reveal>
            JAKE
            <br />
            WORSHAM
          </h1>
          <div className="folio-about-biography">
            <span className="folio-eyebrow">About me</span>
            <p>
              Hi, I’m Jake — a designer and software engineer in Grand Rapids,
              Michigan. At Sync, I build digital experiences across product
              design, applications, and AWS infrastructure.
            </p>
          </div>
        </div>
      </section>
      <section
        className="folio-panel folio-about-introduction"
        data-theme="stone"
        aria-label="About Jake — Introduction"
      >
        <p data-reveal>
          I build software around the work people actually need to do — finding
          the next customer, organizing a busy day, or turning information into
          something useful.
        </p>
        <div className="folio-about-image">
          <img
            src="/projects/prospects.webp"
            alt="Prospects map workspace"
            width={1440}
            height={1000}
          />
        </div>
      </section>
      <section
        className="folio-panel folio-philosophy"
        data-theme="ink"
        aria-label="About Jake — Approach"
      >
        <div>
          <p>
            Start with a conversation. Give the workflow a clear shape. Connect
            the details, then try the entire experience.
          </p>
          <p>
            I care about how an interface looks, how it feels, and what happens
            after someone presses the button.
          </p>
        </div>
        <div>
          <span className="folio-eyebrow">Philosophy</span>
          <blockquote>
            MAKE IT USEFUL.
            <br />
            MAKE IT FEEL RIGHT.
          </blockquote>
        </div>
      </section>
      <section
        className="folio-panel folio-career"
        data-theme="ink"
        aria-label="About Jake — Experience"
      >
        <h2 data-reveal>
          DESIGN.
          <br />
          BUILD.
          <br />
          REFINE.
        </h2>
        <div className="folio-career-table">
          {[
            ["2023 — NOW", "Software Engineer", "Sync"],
            [
              "AI & VOICE",
              "Helga / Receptionist",
              "Assistants and conversation workflows",
            ],
            [
              "SALES SYSTEMS",
              "Prospects",
              "Maps, discovery, and customer relationships",
            ],
            [
              "DOCUMENTS",
              "Documents / RFP Response Builder",
              "From source material to finished PDF",
            ],
            [
              "PUBLISHING",
              "Content studio",
              "Writing, editing, and publishing",
            ],
          ].map(([date, title, note]) => (
            <div key={date}>
              <span>{date}</span>
              <p>
                {title}
                <small>{note}</small>
              </p>
            </div>
          ))}
        </div>
        <p className="folio-career-note">
          ❋ A selection of the systems and workflows
          <br />
          that shape how I design and build.
        </p>
      </section>
      <section
        className="folio-panel folio-about-last"
        data-theme="stone"
        aria-label="About Jake — Next steps"
      >
        <p data-reveal>
          From a map full of opportunities to an assistant that listens — each
          project explores a different way software can make work simpler.
        </p>
        <img
          src="/projects/helga.webp"
          alt="Helga assistant dashboard"
          width={1440}
          height={1000}
        />
        <a href="/works/" className="folio-inline-link">
          Explore the work <ArrowRight size={24} />
        </a>
        <div>
          <span>Open for the next good challenge</span>
          <a href="mailto:jake@syncgr.com">
            Email <span>jake@syncgr.com</span>
          </a>
        </div>
      </section>
    </>
  );
}
