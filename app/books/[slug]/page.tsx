import Link from "next/link";
import { notFound } from "next/navigation";
import "@/app/weekends.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NoteList, TagLinks } from "@/components/notes";
import { site } from "@/content/site";
import { weekends } from "@/content/weekends";
import { getBook, getBooks } from "@/lib/books";
import { formatDay } from "@/lib/format";
import { postsMentioning } from "@/lib/journal";

export function generateStaticParams() {
  return getBooks().map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return {
    title: book.title,
    description: `${book.title} by ${book.author}, logged ${formatDay(book.date)}.`,
    alternates: { canonical: `/books/${book.slug}` },
  };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const notes = postsMentioning("books", book.slug);
  const books = getBooks();
  const index = books.findIndex((item) => item.slug === book.slug);
  const before = books[index - 1];
  const after = books[index + 1];
  const byAuthor = books.filter((item) => item.author === book.author && item.slug !== book.slug);

  return (
    <section className="band wk-scope" data-lane="reading" aria-labelledby="book-heading">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: weekends.title, href: "/weekends" },
            { label: weekends.lanes.reading.label, href: "/books" },
            { label: book.title },
          ]}
        />
        <div className="wk-detail">
          <div className="wk-detail-main">
            <p className="script kicker">book {index + 1} of {books.length}</p>
            <h1 id="book-heading">{book.title}</h1>
            <p className="lede" style={{ margin: 0 }}>
              {book.author}
            </p>
            <TagLinks tags={book.tags} />
            <h2 className="subhead">Notes</h2>
            <NoteList notes={notes} empty={site.books.emptyNotes} />
            <nav className="wk-pager" aria-label="The books before and after">
              {before ? (
                <Link href={`/books/${before.slug}`}>
                  <small>← Read before</small>
                  <span>{before.title}</span>
                </Link>
              ) : null}
              {after ? (
                <Link href={`/books/${after.slug}`}>
                  <small>Read after →</small>
                  <span>{after.title}</span>
                </Link>
              ) : null}
            </nav>
          </div>
          <aside className="wk-card" aria-label="Book details">
            <dl className="wk-facts">
              <div>
                <dt>Author</dt>
                <dd>{book.author}</dd>
              </div>
              <div>
                <dt>Logged</dt>
                <dd>
                  <time dateTime={book.date}>{formatDay(book.date)}</time>
                </dd>
              </div>
              {byAuthor.length > 0 ? (
                <div>
                  <dt>Also by them here</dt>
                  <dd>{byAuthor.length}</dd>
                </div>
              ) : null}
            </dl>
            <p style={{ margin: 0, padding: "0 1.1rem 1rem" }}>
              <Link className="wk-link" href="/books">
                The whole shelf →
              </Link>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
