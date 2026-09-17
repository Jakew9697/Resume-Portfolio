import { notFound } from "next/navigation";
import FolioExperience from "@/components/folio/experience";
import { projects } from "@/components/folio/projects";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: projects.find((project) => project.slug === slug)?.name || "Project",
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!projects.some((project) => project.slug === slug)) notFound();
  return <FolioExperience page="works" projectSlug={slug} />;
}
