import { notFound } from "next/navigation";
import FolioExperience from "@/components/folio/experience";
import { websites } from "@/components/folio/websites";

export function generateStaticParams() {
  return websites.map(({ slug }) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const website = websites.find((entry) => entry.slug === slug);
  return { title: website?.name || "Website", description: website?.overview };
}

export default async function WebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!websites.some((entry) => entry.slug === slug)) notFound();
  return <FolioExperience page="websites" projectSlug={slug} />;
}
