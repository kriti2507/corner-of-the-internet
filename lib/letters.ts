import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { site, type Letter } from "@/content/site";
import { getPosts } from "@/lib/posts";

type ArchivePost = {
  slug?: string;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  canonical_url?: string;
  post_date?: string;
  type?: string;
  reaction_count?: number;
  comment_count?: number;
  restacks?: number;
  wordcount?: number;
};

const MAX_PAGES = 15;

async function archive(sort: "new" | "top"): Promise<ArchivePost[]> {
  const posts: ArchivePost[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(site.writing.archiveUrl);
    url.searchParams.set("sort", sort);
    if (cursor) url.searchParams.set("cursor", cursor);
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "KritiSite/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`archive ${sort} ${response.status}`);
    const body = (await response.json()) as { posts?: ArchivePost[]; nextCursor?: string | null };
    posts.push(...(body.posts ?? []));
    cursor = body.nextCursor ?? null;
    if (!cursor) break;
  }
  return posts;
}

export function slugFromUrl(url: string) {
  const match = url.match(/\/p\/([^/?#]+)/);
  return match ? match[1] : url;
}

/**
 * Every AI Noodle letter with Substack's public numbers.
 * Falls back to the RSS feed (no numbers, no ranking) if the archive is down.
 */
export async function getLetters(): Promise<{ letters: Letter[]; source: "archive" | "live" | "fallback" }> {
  "use cache";
  cacheLife("hours");
  cacheTag("writing");

  try {
    const [newest, top] = await Promise.all([archive("new"), archive("top")]);
    const rankBySlug = new Map(top.map((post, index) => [post.slug, index + 1]));
    const letters: Letter[] = newest
      .filter((post) => post.slug && post.title && post.post_date && post.type !== "podcast")
      .map((post) => ({
        slug: post.slug!,
        title: post.title!.trim(),
        url: post.canonical_url || `${site.writing.publicationUrl}/p/${post.slug}`,
        date: new Date(post.post_date!).toISOString(),
        excerpt: (post.subtitle || post.description || "").trim(),
        likes: post.reaction_count ?? 0,
        comments: post.comment_count ?? 0,
        restacks: post.restacks ?? 0,
        words: post.wordcount ?? 0,
        rank: rankBySlug.get(post.slug) ?? null,
      }));
    if (letters.length === 0) throw new Error("archive empty");
    return { letters, source: "archive" };
  } catch (error) {
    console.error("[writing] archive unavailable, using the feed", error);
    const feed = await getPosts();
    return {
      letters: feed.posts.map((post) => ({
        ...post,
        slug: slugFromUrl(post.url),
        likes: 0,
        comments: 0,
        restacks: 0,
        words: 0,
        rank: null,
      })),
      source: feed.source,
    };
  }
}
