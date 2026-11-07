import Link from "next/link";
import "@/app/weekends.css";
import { Bookshelf } from "@/components/bookshelf";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { weekends } from "@/content/weekends";
import { getBooks } from "@/lib/books";
import { formatDay } from "@/lib/format";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("books");

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BooksPage() {
  const books = getBooks();
  const newestFirst = [...books].reverse();
  const months = new Map<string, typeof books>();
  for (const book of newestFirst) {
    const key = book.date.slice(0, 7);
    months.set(key, [...(months.get(key) ?? []), book]);
  }
  const authors = new Set(books.map((book) => book.author)).size;
  const since = books[0] ? MONTHS[Number(books[0].date.slice(5, 7)) - 1] : null;

  return (
    <section className="band wk-scope" data-lane="reading" aria-labelledby="books-heading">
      <div className="wrap">
        <Breadcrumbs items={[{ label: weekends.title, href: "/weekends" }, { label: weekends.lanes.reading.label }]} />
        <div className="wk-head">
          <p className="script kicker">the shelf</p>
          <h1 id="books-heading">Reading</h1>
          <p className="lede">
            {books.length} books by {authors} authors{since ? ` since ${since}` : ""}, newest first. Pull one off the shelf to open its page.
          </p>
        </div>

        <div className="wk-year">
          <div className="wk-card wk-shelf-card">
            <Bookshelf books={books} />
          </div>

          <div>
            {[...months.entries()].map(([key, items]) => {
              const [year, month] = key.split("-");
              return (
                <section key={key} className="wk-month" aria-labelledby={`month-${key}`}>
                  <h3 id={`month-${key}`}>
                    {MONTHS[Number(month) - 1]} <span className="wk-muted">{year}</span>
                  </h3>
                  <ul>
                    {items.map((book) => (
                      <li key={book.slug}>
                        <Link className="wk-book" href={`/books/${book.slug}`}>
                          <span className="wk-book-title">{book.title}</span>
                          <span className="wk-book-author">{book.author}</span>
                          <time className="wk-book-date" dateTime={book.date}>
                            {formatDay(book.date)}
                          </time>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
