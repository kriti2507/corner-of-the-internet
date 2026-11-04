"use client";

import Link from "next/link";
import { useState } from "react";
import type { Book } from "@/lib/books";
import { formatDay } from "@/lib/format";

const SPINES: { bg: string; fg: string }[] = [
  { bg: "#1c2744", fg: "#f3eee3" },
  { bg: "#6d3140", fg: "#f3eee3" },
  { bg: "#efd15f", fg: "#1c2744" },
  { bg: "#c5d7ea", fg: "#1c2744" },
  { bg: "#f4c9c4", fg: "#1c2744" },
  { bg: "#c9d5b0", fg: "#1c2744" },
  { bg: "#3d4a66", fg: "#f3eee3" },
  { bg: "#f0c9a8", fg: "#1c2744" },
  { bg: "#8a6232", fg: "#f3eee3" },
  { bg: "#2f5d50", fg: "#f3eee3" },
  { bg: "#d7c4e2", fg: "#1c2744" },
  { bg: "#e07a62", fg: "#1c2744" },
];

export function Bookshelf({
  books,
  kicker,
  title,
  lede,
  readLabel,
}: {
  books: Book[];
  kicker: string;
  title: string;
  lede: string;
  readLabel: string;
}) {
  const [selected, setSelected] = useState(books[books.length - 1]?.title ?? "");
  const book = books.find((item) => item.title === selected) ?? books[0];

  return (
    <section className="band band-tight" id="books" aria-labelledby="books-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <h2 id="books-heading">{title}</h2>
        <p className="lede">{lede}</p>
        {book ? (
          <article className="book-card" aria-live="polite">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>
              {readLabel} <time dateTime={book.date}>{formatDay(book.date)}</time>
            </p>
            <p>
              <Link className="card-link" href={`/books/${book.slug}`}>
                Open the page →
              </Link>
            </p>
          </article>
        ) : null}
        <div className="shelf" role="list">
          {books.map((item, index) => {
            const spine = SPINES[index % SPINES.length];
            const height = 128 + (item.title.length % 5) * 14;
            return (
              <button
                key={item.title}
                type="button"
                className="spine"
                aria-pressed={item.title === selected}
                aria-label={`${item.title} by ${item.author}`}
                style={{ background: spine.bg, color: spine.fg, height }}
                onClick={() => setSelected(item.title)}
              >
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
