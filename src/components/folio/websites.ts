import inventory from "../../../scripts/website-inventory.json";
import type { PortfolioProject } from "./projects";

// KB-backed websites; Blue Shore is preserved from its local source build.
export const websites: PortfolioProject[] = inventory.map((site, index) => ({
  slug: site.slug,
  name: site.name,
  category: site.category,
  overview: site.overview,
  scope: ["Web design", "Web development at Sync"],
  features: [],
  technology: "Responsive website",
  liveUrl: site.archived ? undefined : site.url,
  archived: site.archived,
  device: index % 4 === 2 ? "phone" : index % 3 === 1 ? "desktop" : "laptop",
  images: (index % 4 === 2 ? ["mobile", "desktop"] : ["desktop", "mobile"]).map(
    (screen) =>
      screen === "desktop"
        ? {
            src: `/websites/${site.slug}-desktop.jpg`,
            alt: `${site.name} desktop website`,
            width: 1440,
            height: 1000,
            caption: `Desktop — ${site.archived ? "archived website build" : "live website"}`,
            device: index % 3 === 1 ? "desktop" : "laptop",
          }
        : {
            src: `/websites/${site.slug}-mobile.jpg`,
            alt: `${site.name} mobile website`,
            width: 390,
            height: 844,
            caption: `Phone — ${site.archived ? "archived website build" : "responsive website"}`,
            device: "phone",
          },
  ),
}));
