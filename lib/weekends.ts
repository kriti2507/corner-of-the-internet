import { getPlace, getPlaces, PLACE_KINDS } from "@/content/places";
import { japanese, weekends } from "@/content/weekends";
import { getBooks } from "@/lib/books";
import { getHikes } from "@/lib/hikes";

/** Numbers and latest entries for the four Weekends lanes. */
export function weekendSummary() {
  const hikes = getHikes();
  const books = getBooks();
  const places = getPlaces();

  const climbed = hikes.reduce((sum, hike) => sum + hike.climbedM, 0);
  const highest = hikes.reduce((best, hike) => (hike.heightM > best.heightM ? hike : best), hikes[0]);
  const recentHikes = [...hikes].reverse();

  const recentBooks = [...books].reverse();
  const series = new Map<string, number>();
  for (const book of books) {
    const match = book.title.match(/\(([^)]+?)\s+\d+\)/);
    if (match) series.set(match[1], (series.get(match[1]) ?? 0) + 1);
  }
  const topSeries = [...series.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;

  const kindCounts = PLACE_KINDS.map((kind) => ({
    ...kind,
    count: places.filter((place) => place.kind === kind.id).length,
  })).filter((kind) => kind.count > 0);
  const regions = new Set(places.map((place) => place.region));
  const featuredPlace = getPlace(weekends.featuredPlace) ?? places.find((place) => place.myNote) ?? places[0];
  const notedPlaces = places.filter((place) => place.myNote);

  const word = japanese.words.find((item) => item.ja === weekends.featuredWord) ?? japanese.words[0];

  return {
    hikes: { count: hikes.length, climbed, highest, recent: recentHikes },
    reading: { count: books.length, topSeries, recent: recentBooks },
    places: { count: places.length, kinds: kindCounts, regions: regions.size, featured: featuredPlace, noted: notedPlaces },
    japanese: { current: japanese.current, currentNote: japanese.currentNote, next: japanese.next, nextNote: japanese.nextNote, word },
  };
}

export type WeekendSummary = ReturnType<typeof weekendSummary>;
