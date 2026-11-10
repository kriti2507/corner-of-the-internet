import type { MetadataRoute } from "next";
import { getPlaces } from "@/content/places";
import { site } from "@/content/site";
import { getBooks } from "@/lib/books";
import { getHikes } from "@/lib/hikes";
import { getJournalPosts } from "@/lib/journal";
import { absolute } from "@/lib/structured-data";
import { allTags } from "@/lib/tags";

/** Every public page, so search and answer engines can find them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getJournalPosts();
  const latest = posts[0]?.date;

  const pages = ["/", "/writing", "/blog", "/weekends", "/places", "/hikes", "/books", "/japanese", "/small-wins", "/about"];

  return [
    ...pages.map((path) => ({
      url: absolute(path),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: absolute(`/blog/${post.slug}`),
      lastModified: post.date || latest,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...site.work.series.map((item) => ({ url: absolute(`/series/${item.slug}`), priority: 0.6 })),
    ...getPlaces().map((place) => ({ url: absolute(`/places/${place.slug}`), priority: 0.6 })),
    ...getHikes().map((hike) => ({ url: absolute(`/hikes/${hike.slug}`), lastModified: hike.date, priority: 0.5 })),
    ...getBooks().map((book) => ({ url: absolute(`/books/${book.slug}`), lastModified: book.date, priority: 0.4 })),
    ...allTags().map((tag) => ({ url: absolute(`/tags/${tag}`), priority: 0.3 })),
  ];
}
