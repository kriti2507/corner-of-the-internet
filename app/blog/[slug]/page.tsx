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
import { JsonLd, absolute, personData } from "@/lib/structured-data";

export function generateStaticParams() {
  const slugs = getJournalPosts().map((post) => ({ slug: post.slug }));
  // Cache Components needs at least one param. With no notes yet, this one
  // 404s (there's no post called "none") and isn't in the sitemap.
  return slugs.length > 0 ? slugs : [{ slug: "none" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      siteName: site.name,
      type: "article",
      publishedTime: post.date || undefined,
      authors: [site.name],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  const cafes = post.cafes.map((item) => getCafe(item)).filter((item) => item !== null);
  const books = post.books.map((item) => getBook(item)).filter((item) => item !== null);
  const hikes = post.hikes.map((item) => getHike(item)).filter((item) => item !== null);
  const series = post.series ? site.work.series.find((item) => item.slug === post.series) ?? null : null;

  return (
    <article className="band" aria-labelledby="post-heading">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.date || undefined,
          url: absolute(`/blog/${post.slug}`),
          mainEntityOfPage: absolute(`/blog/${post.slug}`),
          keywords: post.tags.join(", "),
          inLanguage: "en",
          author: personData,
          publisher: personData,
        }}
      />
      <div className="wrap journal">
        {post.sample ? <SampleMark /> : null}
        <p className="script kicker">{formatDay(post.date)}</p>
        <h1 id="post-heading">{post.title}</h1>
        <p className="lede">{post.summary}</p>
        <TagLinks tags={post.tags} />
        {series ? (
          <p className="note">
            {site.work.partOf} <Link href={`/series/${series.slug}`}>{series.title} →</Link>
          </p>
        ) : null}
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
                <Link href={`/places/${cafe.slug}`}>{cafe.name}</Link>
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
