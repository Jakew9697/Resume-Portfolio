import type { MetadataRoute } from "next";
import { projects } from "@/components/folio/projects";
import { websites } from "@/components/folio/websites";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "about/",
    "works/",
    "websites/",
    "contact/",
    ...websites.map((website) => `websites/${website.slug}/`),
    ...projects.flatMap((project) => [
      `works/${project.slug}/`,
      ...(project.liveUrl ? [] : [`${project.slug}/`]),
    ]),
  ].map((path) => ({ url: `https://jakeworsham.syncgr.com/${path}` }));
}
