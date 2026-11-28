import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSection, getSections } from "@/lib/content";
import { Crumbs, SectionBlock } from "@/components/bits";

export function generateStaticParams() {
  return getSections().map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) return {};
  return {
    title: section.title,
    description: section.summary,
    alternates: { canonical: `/coffee/sections/${slug}` },
    openGraph: { title: section.title, description: section.summary, url: `/coffee/sections/${slug}` },
  };
}

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();
  return (
    <div className="wrap">
      <header className="page-head">
        <Crumbs items={[{ label: section.title }]} />
      </header>
      <SectionBlock section={section} heading="h1" />
    </div>
  );
}
