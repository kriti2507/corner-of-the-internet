import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteList, TagLinks } from "@/components/notes";
import { site } from "@/content/site";
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
  return { title: book.title, description: `${book.title}, ${book.author}.` };
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const notes = postsMentioning("books", book.slug);

  return (
    <section className="band" aria-labelledby="book-heading">
      <div className="wrap journal">
        <p className="script kicker">{site.books.kicker}</p>
        <h1 id="book-heading">{book.title}</h1>
        <p className="lede">{book.author}</p>
        <p>
          {site.books.readLabel} <time dateTime={book.date}>{formatDay(book.date)}</time>
        </p>
        <TagLinks tags={book.tags} />
        <p>
          <Link href="/books">All the books →</Link>
        </p>
        <h2 className="subhead">Notes</h2>
        <NoteList notes={notes} empty={site.books.emptyNotes} />
      </div>
    </section>
  );
}
