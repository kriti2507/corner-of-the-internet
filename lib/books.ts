import booksJson from "@/data/books.json";
import { slugify } from "@/lib/slug";

export type Book = {
  slug: string;
  title: string;
  author: string;
  date: string;
  /**
   * Only tags that are written in the title. Genre is not guessed.
   * Add more in the title parentheses, or extend seriesTag when you want a genre.
   */
  tags: string[];
};

type RawBook = {
  title: string;
  author: string;
  date: string;
};

/**
 * Bundled bookshelf.
 *
 * To go live, replace this function with the Small Wins API
 * (topic "books", fields title and author) and keep this Book shape.
 */
function seriesTag(title: string) {
  const match = title.match(/\(([^)]+)\)/);
  if (!match) return null;
  return slugify(match[1].replace(/\s+\d+$/, ""));
}

export function getBooks(): Book[] {
  return (booksJson as RawBook[])
    .map((book) => {
      const series = seriesTag(book.title);
      return {
        slug: slugify(book.title),
        title: book.title,
        author: book.author,
        date: book.date,
        tags: series ? [series] : [],
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getBook(slug: string) {
  return getBooks().find((book) => book.slug === slug) ?? null;
}
