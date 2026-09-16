import type { MouseEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { FolioSlide } from "./folio-carousel";

export const pages = [
  ["home", "Home"],
  ["about", "About"],
  ["work", "Work"],
  ["contact", "Contact"],
] as const;
export type FolioPage = (typeof pages)[number][0];

const projects = [
  {
    slug: "prospects",
    name: "Prospects",
    kind: "Sales operations / Maps / Product design",
    text: "A map of the next opportunity.",
  },
  {
    slug: "helga",
    name: "Helga",
    kind: "Voice / AI / Interface design",
    text: "A quiet space for a busy day.",
  },
  {
    slug: "receptionist",
    name: "Receptionist",
    kind: "Voice AI / Customer experience",
    text: "Every conversation, accounted for.",
  },
  {
    slug: "documents",
    name: "Documents",
    kind: "Automation / AI / PDF",
    text: "From rough notes to ready to share.",
  },
  {
    slug: "rfp",
    name: "RFP workspace",
    kind: "Research / AI / Document workflows",
    text: "A response grounded in the details.",
  },
  {
    slug: "cms",
    name: "Content studio",
    kind: "Content / Publishing / Web design",
    text: "A simpler way to put ideas online.",
  },
];

export function createFolioContent(
  go: (event: MouseEvent<HTMLAnchorElement>, page: FolioPage) => void,
): Record<FolioPage, FolioSlide[]> {
  return {
    home: [
      {
        id: "introduction",
        title: "Introduction",
        className: "folio-hero",
        content: (
          <>
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
                Meet Jake <ArrowUpRight size={22} />
              </a>
            </div>
          </>
        ),
      },
      {
        id: "practice",
        title: "Design & engineering",
        className: "folio-manifesto",
        content: (
          <>
            <span className="folio-kicker">
              From an idea to something you can use.
            </span>
            <h2>
              A thought.
              <br />A conversation.
              <br />
              <em>A working thing.</em>
            </h2>
            <div className="folio-editorial-bottom">
              <p>
                Product design, useful automation, and the details that make an
                interface feel right.
              </p>
              <a
                className="folio-text-link"
                href="#work"
                onClick={(e) => go(e, "work")}
              >
                Explore the work <ArrowRight size={24} />
              </a>
            </div>
          </>
        ),
      },
    ],
    about: [
      {
        id: "jake",
        title: "A little about me",
        className: "folio-about",
        content: (
          <>
            <div className="folio-about-copy">
              <span className="folio-kicker">A little about me</span>
              <h2>
                Hi, I’m Jake.
                <br />I like making complicated work feel simple.
              </h2>
              <p>
                I work where product design, code, and real business needs meet.
                From the first conversation to the last working detail.
              </p>
              <a
                className="folio-text-link"
                href="#work"
                onClick={(e) => go(e, "work")}
              >
                Explore the work <ArrowRight size={24} />
              </a>
            </div>
            <div className="folio-monogram" aria-label="Jake Worsham monogram">
              <span>
                J<span>W</span>
              </span>
              <small>DESIGN. BUILD. REPEAT.</small>
            </div>
          </>
        ),
      },
      {
        id: "design",
        title: "Understand & design",
        className: "folio-process",
        content: (
          <>
            <span className="folio-kicker">How I work / The beginning</span>
            <h2>
              First, the people.
              <br />
              <em>Then, the pixels.</em>
            </h2>
            <div className="folio-service-pair">
              <div>
                <span>01</span>
                <h3>Understand</h3>
                <p>
                  Find the work behind the request. Talk to the people doing it.
                </p>
              </div>
              <div>
                <span>02</span>
                <h3>Design</h3>
                <p>
                  Give the workflow a clear shape and the interface a considered
                  feel.
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        id: "build",
        title: "Build & refine",
        className: "folio-process",
        content: (
          <>
            <span className="folio-kicker">
              How I work / Bringing it to life
            </span>
            <h2>
              Make it work.
              <br />
              <em>Make it feel right.</em>
            </h2>
            <div className="folio-service-pair">
              <div>
                <span>03</span>
                <h3>Build</h3>
                <p>
                  Connect the experience to real data, useful automation, and
                  reliable services.
                </p>
              </div>
              <div>
                <span>04</span>
                <h3>Refine</h3>
                <p>
                  Try the whole journey. Notice what gets in the way. Make it
                  better.
                </p>
              </div>
            </div>
          </>
        ),
      },
    ],
    work: projects.map((project, index) => ({
      id: project.slug,
      title: project.name,
      className: `folio-project project-${project.slug}`,
      content: (
        <>
          <img
            className="folio-project-preview"
            src={`/projects/${project.slug}.webp`}
            alt={`${project.name} application preview`}
            width={1440}
            height={1000}
            loading={index === 0 ? "eager" : "lazy"}
            draggable={false}
          />
          <div className="folio-project-shade" aria-hidden="true" />
          {project.slug === "prospects" && (
            <span className="folio-map-credit">
              Google / Map data ©2026 Google
            </span>
          )}
          <div className="folio-project-caption">
            <div>
              <span className="folio-kicker">{project.kind}</span>
              <h2>{project.name}</h2>
              <p>{project.text}</p>
            </div>
            <a
              className="folio-project-open"
              href={`/${project.slug}/`}
              aria-label={`Open ${project.name} project`}
            >
              Open project <ArrowUpRight size={32} strokeWidth={1.2} />
            </a>
          </div>
        </>
      ),
    })),
    contact: [
      {
        id: "next-chapter",
        title: "Start a conversation",
        className: "folio-contact",
        content: (
          <>
            <div className="folio-contact-top">
              <span className="folio-kicker">Where ideas become useful</span>
              <p>
                Have a role, project, or
                <br />
                interesting problem in mind?
              </p>
            </div>
            <a href="mailto:jake@syncgr.com" className="folio-next">
              <h2>
                Next
                <br />
                <em>chapter</em>
              </h2>
              <ArrowUpRight strokeWidth={0.7} />
            </a>
            <a className="folio-email" href="mailto:jake@syncgr.com">
              jake@syncgr.com <ArrowUpRight size={23} />
            </a>
          </>
        ),
      },
      {
        id: "elsewhere",
        title: "Find me elsewhere",
        className: "folio-elsewhere",
        content: (
          <>
            <span className="folio-kicker">Keep in touch</span>
            <h2>
              A few ways
              <br />
              <em>to connect.</em>
            </h2>
            <div className="folio-social-links">
              <a href="mailto:jake@syncgr.com">
                <span>
                  Email<small>jake@syncgr.com</small>
                </span>
                <ArrowUpRight />
              </a>
              <a
                href="https://linkedin.com/in/jakeworsham"
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  LinkedIn<small>Let’s connect</small>
                </span>
                <ArrowUpRight />
              </a>
              <a
                href="https://github.com/Jakew9697"
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  GitHub<small>Explore the code</small>
                </span>
                <ArrowUpRight />
              </a>
            </div>
            <p className="folio-location">
              Grand Rapids, Michigan / © 2026 Jake Worsham
            </p>
          </>
        ),
      },
    ],
  };
}
