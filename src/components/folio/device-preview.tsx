import type { CSSProperties } from "react";
import type { PortfolioProject } from "./projects";

export type DeviceKind = "laptop" | "desktop" | "tablet" | "phone" | "tv";
export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  device: DeviceKind;
};

export function projectImages(project: PortfolioProject): ProjectImage[] {
  return project.images ?? [{
    src: `/projects/${project.slug}.webp`,
    alt: `${project.name} full application preview`,
    width: 1440,
    height: 1000,
    caption: project.technology,
    device: project.device,
  }];
}

function Device({ image, loading }: {
  image: ProjectImage;
  loading: "eager" | "lazy";
}) {
  return (
    <div className={`folio-device device-${image.device}`} data-device={image.device}>
      <div className="device-body">
        <span className="device-camera" aria-hidden="true" />
        <div className="device-screen">
          <img
            src={image.src}
            alt={`${image.alt} displayed on a ${image.device === "tv" ? "television" : image.device}`}
            width={image.width}
            height={image.height}
            loading={loading}
          />
        </div>
      </div>
      {image.device === "laptop" && <div className="device-keyboard" aria-hidden="true" />}
      {image.device === "desktop" && <div className="device-stand" aria-hidden="true" />}
      {image.device === "tv" && <div className="device-feet" aria-hidden="true" />}
    </div>
  );
}

export function DevicePreview({ project, image, loading = "lazy", className = "", style }: {
  project: PortfolioProject;
  image?: ProjectImage;
  loading?: "eager" | "lazy";
  className?: string;
  style?: CSSProperties;
}) {
  const images = projectImages(project);
  const ensemble = !image && project.slug === "move-v";
  return (
    <div
      className={`device-scene scene-${project.slug} ${ensemble ? "scene-ensemble" : ""} ${className}`}
      data-presentation={ensemble ? "ensemble" : image?.device ?? project.device}
      style={style}
    >
      <div className="device-studio" aria-hidden="true" />
      <div className="device-platform" aria-hidden="true" />
      {ensemble ? images.filter((preview) => preview.device !== "desktop").map((preview) => (
        <Device key={preview.src} image={preview} loading={loading} />
      )) : <Device image={image ?? images[0]} loading={loading} />}
    </div>
  );
}
