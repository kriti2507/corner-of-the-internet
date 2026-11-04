import booksJson from "@/data/books.json";

export type Book = {
  title: string;
  author: string;
  date: string;
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
export function getBooks(): Book[] {
  return (booksJson as RawBook[])
    .map((book) => ({
      title: book.title,
      author: book.author,
      date: book.date,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
