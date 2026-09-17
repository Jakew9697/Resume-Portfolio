import type { MetadataRoute } from "next";
import { projects } from "@/components/folio/projects";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "about/",
    "works/",
    "contact/",
    ...projects.flatMap((project) => [
      `works/${project.slug}/`,
      `${project.slug}/`,
    ]),
  ].map((path) => ({ url: `https://jakeworsham.syncgr.com/${path}` }));
}
