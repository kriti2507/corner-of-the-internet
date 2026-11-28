import Link from "next/link";
import { notFound } from "next/navigation";
import { External } from "@/components/external";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SampleMark, TagLinks } from "@/components/notes";
import { SakanaNoteCard } from "@/components/sakana";
import { getCafe } from "@/content/cafes";
import { site } from "@/content/site";
import { getBook } from "@/lib/books";
import { getHike } from "@/lib/hikes";
import { getJournalPost, getJournalPosts, sakanaNotes } from "@/lib/journal";
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

  if (post.sakana) return <SakanaPost slug={post.slug} />;

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

/** A Sakana App note: a reading page with its number, and the older and newer notes at the end. */
function SakanaPost({ slug }: { slug: string }) {
  const notes = sakanaNotes();
  const index = notes.findIndex((note) => note.slug === slug);
  const post = notes[index];
  if (!post) notFound();
  const newer = notes[index - 1];
  const older = notes[index + 1];
  const copy = site.work.post;

  return (
    <article className="sk-scope sk-post" aria-labelledby="post-heading">
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
          isPartOf: absolute(site.work.index.path),
          author: personData,
          publisher: personData,
        }}
      />
      <header className="sk-post-head">
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: site.work.index.crumb, href: site.work.index.path },
              { label: `${site.work.note} ${post.number}` },
            ]}
          />
          <div className="sk-post-title">
            <span className="sk-num sk-num-lg" aria-hidden="true">
              {String(post.number).padStart(2, "0")}
            </span>
            <div>
              <p className="script kicker">
                {copy.kicker}, {site.work.note.toLowerCase()} {post.number} {copy.of} {notes.length}
              </p>
              <h1 id="post-heading">{post.title}</h1>
            </div>
          </div>
          <p className="lede sk-post-lede">{post.summary}</p>
          <ul className="sk-meta">
            <li>
              <time dateTime={post.date}>{formatDay(post.date)}</time>
            </li>
            <li>{site.work.minutes.replace("{n}", String(post.minutes))}</li>
          </ul>
        </div>
      </header>
      <div className="wrap sk-post-body">
        {post.sample ? <SampleMark /> : null}
        <div className="journal-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        <TagLinks tags={post.tags} />
      </div>
      <nav className="wrap sk-post-nav" aria-label="More Sakana App notes">
        <ul className="sk-pair">
          {older ? (
            <li>
              <p className="sk-pair-label">{copy.previous}</p>
              <SakanaNoteCard note={older} noteLabel={site.work.note} minutesLabel={site.work.minutes} tilt={1} />
            </li>
          ) : null}
          {newer ? (
            <li>
              <p className="sk-pair-label">{copy.next}</p>
              <SakanaNoteCard note={newer} noteLabel={site.work.note} minutesLabel={site.work.minutes} tilt={2} />
            </li>
          ) : null}
        </ul>
        <p className="sk-all">
          <Link href={site.work.index.path}>{copy.back}</Link>
        </p>
      </nav>
    </article>
  );
}
