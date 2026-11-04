import Link from "next/link";
import { notFound } from "next/navigation";
import { External } from "@/components/external";
import { SampleMark, TagLinks } from "@/components/notes";
import { getCafe } from "@/content/cafes";
import { site } from "@/content/site";
import { getBook } from "@/lib/books";
import { getHike } from "@/lib/hikes";
import { getJournalPost, getJournalPosts } from "@/lib/journal";
import { renderMarkdown } from "@/lib/markdown";
import { formatDay } from "@/lib/format";

export function generateStaticParams() {
  return getJournalPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  const cafes = post.cafes.map((item) => getCafe(item)).filter((item) => item !== null);
  const books = post.books.map((item) => getBook(item)).filter((item) => item !== null);
  const hikes = post.hikes.map((item) => getHike(item)).filter((item) => item !== null);

  return (
    <article className="band" aria-labelledby="post-heading">
      <div className="wrap journal">
        {post.sample ? <SampleMark /> : null}
        <p className="script kicker">{formatDay(post.date)}</p>
        <h1 id="post-heading">{post.title}</h1>
        <p className="lede">{post.summary}</p>
        <TagLinks tags={post.tags} />
        {post.external ? (
          <p>
            <External className="btn btn-ink" href={post.external}>
              {site.blog.externalLabel}
            </External>
          </p>
        ) : null}
        {post.body ? (
          <div className="journal-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        ) : null}
        <h2 className="subhead">{site.blog.mentions}</h2>
        {cafes.length + books.length + hikes.length === 0 ? (
          <p className="quiet-note">{site.blog.noMentions}</p>
        ) : (
          <ul className="text-links">
            {cafes.map((cafe) => (
              <li key={cafe.slug}>
                <Link href={`/coffee/${cafe.slug}`}>{cafe.name}</Link>
              </li>
            ))}
            {books.map((book) => (
              <li key={book.slug}>
                <Link href={`/books/${book.slug}`}>{book.title}</Link>
              </li>
            ))}
            {hikes.map((hike) => (
              <li key={hike.slug}>
                <Link href={`/hikes/${hike.slug}`}>{hike.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
