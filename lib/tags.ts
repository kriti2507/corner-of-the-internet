import "server-only";

import { getCafes } from "@/content/cafes";
import { getBooks } from "@/lib/books";
import { getHikes } from "@/lib/hikes";
import { getJournalPosts, type JournalPost } from "@/lib/journal";

export function allTags() {
  const tags = new Set<string>();
  for (const post of getJournalPosts()) post.tags.forEach((tag) => tags.add(tag));
  for (const cafe of getCafes()) cafe.tags.forEach((tag) => tags.add(tag));
  for (const book of getBooks()) book.tags.forEach((tag) => tags.add(tag));
  for (const hike of getHikes()) hike.tags.forEach((tag) => tags.add(tag));
  return [...tags].sort();
}

export function tagged() {
  return {
    posts: getJournalPosts(),
    cafes: getCafes(),
    books: getBooks(),
    hikes: getHikes(),
  };
}

export function forTag(tag: string): {
  posts: JournalPost[];
  cafes: ReturnType<typeof getCafes>;
  books: ReturnType<typeof getBooks>;
  hikes: ReturnType<typeof getHikes>;
} {
  const all = tagged();
  return {
    posts: all.posts.filter((post) => post.tags.includes(tag)),
    cafes: all.cafes.filter((cafe) => cafe.tags.includes(tag)),
    books: all.books.filter((book) => book.tags.includes(tag)),
    hikes: all.hikes.filter((hike) => hike.tags.includes(tag)),
  };
}
