"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookshelf } from "@/components/bookshelf";
import { tagLabel } from "@/lib/slug";

type Item = {
  slug: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
};

export function BookHub({
  kicker,
  title,
  lede,
  books,
  allLabel,
}: {
  kicker: string;
  title: string;
  lede: string;
  books: Item[];
  allLabel: string;
}) {
  const [tag, setTag] = useState<string | null>(null);
  const tags = [...new Set(books.flatMap((book) => book.tags))].sort();
  const visible = tag ? books.filter((book) => book.tags.includes(tag)) : books;

  return (
    <section className="band" aria-labelledby="books-hub-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <h1 id="books-hub-heading">{title}</h1>
        <p className="lede">{lede}</p>
        <Bookshelf books={visible} />
        <div className="chips" role="toolbar" aria-label="Book tags">
          <button type="button" className="chip" aria-pressed={tag === null} onClick={() => setTag(null)}>
            {allLabel}
          </button>
          {tags.map((item) => (
            <button key={item} type="button" className="chip" aria-pressed={tag === item} onClick={() => setTag(item)}>
              {tagLabel(item)}
            </button>
          ))}
        </div>
        <ul className="post-grid">
          {visible.map((book) => (
            <li key={book.slug}>
              <Link className="post-card" href={`/books/${book.slug}`}>
                <time dateTime={book.date}>{book.date}</time>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <span className="card-link">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
