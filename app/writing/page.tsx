import { WritingIndex } from "@/components/writing-index";
import { site } from "@/content/site";
import { getJournalPosts } from "@/lib/journal";
import { pageMetadata } from "@/lib/page-meta";
import { getPosts } from "@/lib/posts";

export const metadata = pageMetadata("writing");

export default async function WritingPage() {
  const [writing, notes] = await Promise.all([getPosts(), Promise.resolve(getJournalPosts())]);

  return (
    <WritingIndex
      kicker={site.writing.kicker}
      title={site.writing.title}
      lede={site.writing.lede}
      publicationUrl={site.writing.publicationUrl}
      allLabel={site.writing.allLabel}
      sitePosts={notes.map((note) => ({
        slug: note.slug,
        title: note.title,
        date: note.date,
        summary: note.summary,
        external: note.external,
        sample: note.sample,
      }))}
      noodlePosts={writing.posts}
      source={writing.source}
      fallbackNote={site.writing.fallbackNote}
      filters={site.writing.filters}
    />
  );
}
