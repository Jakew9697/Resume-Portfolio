"use client";
import { DevicePreview, projectImages } from "./device-preview";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects, type PortfolioProject } from "./projects";
import { websites } from "./websites";

export function Works({
  initialSlug,
  collection = "works",
}: {
  initialSlug?: string;
  collection?: "works" | "websites";
}) {
  const entries = collection === "websites" ? websites : projects;
  const [selected, setSelected] = useState(
    () => entries.find((project) => project.slug === initialSlug) || null,
  );
  const viewport = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const open = (
    event: MouseEvent<HTMLAnchorElement>,
    project: PortfolioProject | null,
  ) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    history.pushState(
      null,
      "",
      project ? `/${collection}/${project.slug}/` : `/${collection}/`,
    );
    setSelected(project);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    const sync = () => {
      setSelected(
        entries.find(
          (project) => project.slug === location.pathname.split("/")[2],
        ) || null,
      );
    };
    addEventListener("popstate", sync);
    return () => removeEventListener("popstate", sync);
  }, [entries]);
  useEffect(() => {
    const element = viewport.current;
    const row = gallery.current;
    if (!element || !row || selected) return;
    let target = 0,
      frame = 0;
    try {
      target =
        Number(sessionStorage.getItem(`folio:${collection}:position`)) || 0;
      element.scrollLeft = target;
    } catch {
      /* Optional position memory. */
    }
    const animate = () => {
      const difference = target - element.scrollLeft;
      element.scrollLeft =
        Math.abs(difference) < 1
          ? target
          : element.scrollLeft + difference * 0.18;
      row.style.setProperty(
        "--gallery-tilt",
        `${Math.max(-8, Math.min(8, -difference * 0.018))}deg`,
      );
      frame =
        Math.abs(target - element.scrollLeft) < 1
          ? 0
          : requestAnimationFrame(animate);
      if (!frame) row.style.setProperty("--gallery-tilt", "0deg");
    };
    const wheel = (event: WheelEvent) => {
      if (
        !matchMedia("(min-width: 768px)").matches ||
        document.querySelector(".folio-menu[open]")
      )
        return;
      event.preventDefault();
      target = Math.max(
        0,
        Math.min(
          element.scrollWidth - element.clientWidth,
          target +
            (Math.abs(event.deltaX) > Math.abs(event.deltaY)
              ? event.deltaX
              : event.deltaY),
        ),
      );
      if (matchMedia("(prefers-reduced-motion: reduce)").matches)
        element.scrollLeft = target;
      else if (!frame) frame = requestAnimationFrame(animate);
    };
    const remember = () => {
      try {
        sessionStorage.setItem(
          `folio:${collection}:position`,
          String(element.scrollLeft),
        );
      } catch {
        /* Optional position memory. */
      }
    };
    const pointer = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      target = element.scrollLeft;
      row.style.setProperty("--gallery-tilt", "0deg");
    };
    const move = () => {
      if (!frame) target = element.scrollLeft;
      remember();
    };
    window.addEventListener("wheel", wheel, { passive: false });
    element.addEventListener("scroll", move, { passive: true });
    element.addEventListener("pointerdown", pointer);
    element.addEventListener("keydown", pointer);
    return () => {
      remember();
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", wheel);
      element.removeEventListener("scroll", move);
      element.removeEventListener("pointerdown", pointer);
      element.removeEventListener("keydown", pointer);
    };
  }, [selected, collection]);

  if (selected)
    return (
      <ProjectDetail
        key={selected.slug}
        project={selected}
        collection={collection}
        entries={entries}
        onNavigate={open}
      />
    );
  return (
    <section
      className="folio-works-index"
      data-collection={collection}
      aria-label={collection === "websites" ? "Websites" : "All work"}
    >
      <div className="folio-works-heading">
        <h1>{collection === "websites" ? "WEBSITES" : "ALL WORK"}</h1>
        <span>({entries.length})</span>
      </div>
      <div
        className="folio-works-viewport"
        ref={viewport}
        tabIndex={0}
        aria-label={
          collection === "websites" ? "Website gallery" : "Project gallery"
        }
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            event.currentTarget.scrollBy({
              left: (event.key === "ArrowRight" ? 1 : -1) * innerWidth * 0.3,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            });
          }
        }}
      >
        <div className="folio-works-track" ref={gallery}>
          {entries.map((project, index) => (
            <article className="folio-work-item" key={project.slug}>
              <a
                href={`/${collection}/${project.slug}/`}
                onClick={(event) => open(event, project)}
                aria-label={`View ${project.name} project details`}
              >
                <div className="folio-work-image">
                  <DevicePreview
                    project={project}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                </div>
              </a>
              <div className="folio-work-caption">
                <span>{String(index + 1).padStart(2, "0")}.</span>
                <div>
                  <p>
                    {project.category}
                    {project.year ? ` — ${project.year}` : ""}
                  </p>
                  <a
                    href={`/${collection}/${project.slug}/`}
                    onClick={(event) => open(event, project)}
                  >
                    {project.name}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectDetail({
  project,
  collection,
  entries,
  onNavigate,
}: {
  project: PortfolioProject;
  collection: "works" | "websites";
  entries: PortfolioProject[];
  onNavigate: (
    event: MouseEvent<HTMLAnchorElement>,
    project: PortfolioProject | null,
  ) => void;
}) {
  const next = entries[(entries.indexOf(project) + 1) % entries.length];
  useEffect(() => {
    document
      .querySelector<HTMLElement>(".folio-detail-back")
      ?.focus({ preventScroll: true });
  }, []);
  return (
    <section
      className="folio-project-detail"
      data-collection={collection}
      aria-label={`${project.name} project details`}
    >
      <div className="folio-detail-copy">
        <a
          className="folio-detail-back"
          href={`/${collection}/`}
          onClick={(event) => onNavigate(event, null)}
        >
          <ArrowLeft size={15} /> Back
        </a>
        <h1>{project.name}</h1>
        <div className="folio-detail-information">
          <div className="folio-detail-row">
            <span className="folio-eyebrow">Overview</span>
            <p>{project.overview}</p>
          </div>
          <div className="folio-detail-row">
            <span className="folio-eyebrow">Details</span>
            <dl>
              <div>
                <dt>Project</dt>
                <dd>{collection === "websites" ? "Website" : "Application"}</dd>
              </div>
              {project.year && (
                <div>
                  <dt>Year</dt>
                  <dd>{project.year}</dd>
                </div>
              )}
              <div>
                <dt>Preview</dt>
                <dd>
                  {project.archived ? (
                    <span data-archive>Archived website</span>
                  ) : (
                    <a href={project.liveUrl ?? `/${project.slug}/`}>
                      See It Live <ArrowRight size={15} />
                    </a>
                  )}
                </dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>
                  {project.scope.map((scope) => (
                    <span key={scope}>{scope}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
          <div className="folio-detail-row folio-detail-next">
            <span className="folio-eyebrow">
              Next {collection === "websites" ? "website" : "project"}
            </span>
            <a
              href={`/${collection}/${next.slug}/`}
              onClick={(event) => onNavigate(event, next)}
            >
              {next.name}
            </a>
          </div>
        </div>
      </div>
      <div
        className="folio-detail-gallery"
        tabIndex={0}
        aria-label={`${project.name} project gallery`}
      >
        {projectImages(project).map((preview, index) => (
          <figure key={preview.src}>
            <DevicePreview
              project={project}
              image={preview}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <figcaption>{preview.caption}</figcaption>
          </figure>
        ))}
        <div className="folio-detail-features">
          <span className="folio-eyebrow">
            {project.archived
              ? "Project archive"
              : collection === "websites"
                ? "Visit the website"
                : "Try the experience"}
          </span>
          {project.features.map((feature, index) => (
            <p key={feature}>
              <small>0{index + 1}</small>
              {feature}
            </p>
          ))}
          {project.archived ? (
            <p>Desktop and mobile views preserved from the website build.</p>
          ) : (
            <a href={project.liveUrl ?? `/${project.slug}/`}>
              Open {project.name} <ArrowRight size={26} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
