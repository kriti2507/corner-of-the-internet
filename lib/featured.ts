import { getCafes, type Cafe } from "@/content/cafes";
import { getBooks, type Book } from "@/lib/books";
import { getHikes, type Hike } from "@/lib/hikes";

function latest<T extends { date: string }>(items: T[], slug: string | null, slugOf: (item: T) => string) {
  if (slug) return items.find((item) => slugOf(item) === slug) ?? items[items.length - 1] ?? null;
  return items[items.length - 1] ?? null;
}

export function featuredWeekend(choice: { hike: string | null; book: string | null; cafe: string | null }): {
  hike: Hike | null;
  book: Book | null;
  cafe: Cafe | null;
} {
  const hikes = getHikes();
  const books = getBooks();
  const cafes = getCafes();
  return {
    hike: latest(hikes, choice.hike, (item) => item.slug),
    book: latest(books, choice.book, (item) => item.slug),
    cafe: choice.cafe ? (cafes.find((item) => item.slug === choice.cafe) ?? cafes[0] ?? null) : (cafes[0] ?? null),
  };
}
