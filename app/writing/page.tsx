import { WritingSection } from "@/components/writing-section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";
import { getPosts } from "@/lib/posts";

export const metadata = pageMetadata("writing");

export default async function WritingPage() {
  const writing = await getPosts();

  return (
    <WritingSection
      kicker={site.writing.kicker}
      title={site.writing.title}
      lede={site.writing.lede}
      posts={writing.posts}
      source={writing.source}
      fallbackNote={site.writing.fallbackNote}
      publicationUrl={site.writing.publicationUrl}
      allLabel={site.writing.allLabel}
    />
  );
}
