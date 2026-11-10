import { WritingIndex, type WritingItem } from "@/components/writing-index";
import { site, type WritingTopic } from "@/content/site";
import { getJournalPosts } from "@/lib/journal";
import { getLetters } from "@/lib/letters";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("writing");

function topicFor(slug: string, text: string): WritingTopic {
  const { topics, otherTopic } = site.writing;
  const listed = topics.find((topic) => topic.slugs.includes(slug));
  if (listed) return listed;
  const haystack = text.toLowerCase();
  return topics.find((topic) => topic.keywords.some((word) => haystack.includes(word))) ?? otherTopic;
}

export default async function WritingPage() {
  const [{ letters, source }, notes] = await Promise.all([getLetters(), Promise.resolve(getJournalPosts())]);

  // A note that points at a Substack letter stands in for that letter.
  const pointedAt = new Set(notes.flatMap((note) => (note.external ? [note.external] : [])));

  const items: WritingItem[] = [
    ...notes.map((note) => ({
      id: `note:${note.slug}`,
      kind: "note" as const,
      title: note.title,
      href: note.external ?? `/blog/${note.slug}`,
      external: Boolean(note.external),
      date: note.date,
      summary: note.summary,
      sample: note.sample,
      topic: site.writing.journalTopic.id,
      likes: 0,
      comments: 0,
      restacks: 0,
      words: 0,
      rank: null,
    })),
    ...letters
      .filter((letter) => !pointedAt.has(letter.url))
      .map((letter) => ({
        id: `letter:${letter.slug}`,
        kind: "letter" as const,
        title: letter.title,
        href: letter.url,
        external: true,
        date: letter.date,
        summary: letter.excerpt,
        sample: false,
        topic: topicFor(letter.slug, `${letter.title} ${letter.excerpt}`).id,
        likes: letter.likes,
        comments: letter.comments,
        restacks: letter.restacks,
        words: letter.words,
        rank: letter.rank,
      })),
  ];

  return (
    <WritingIndex
      kicker={site.writing.kicker}
      title={site.writing.title}
      lede={site.writing.lede}
      publicationUrl={site.writing.publicationUrl}
      allLabel={site.writing.allLabel}
      items={items}
      topics={[...site.writing.topics, site.writing.otherTopic, site.writing.journalTopic]}
      views={site.writing.views}
      copy={site.writing.viewCopy}
      hasStats={source === "archive"}
      fallbackNote={source === "fallback" ? site.writing.fallbackNote : null}
    />
  );
}
