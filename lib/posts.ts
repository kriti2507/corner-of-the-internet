import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { site, type Post } from "@/content/site";
import { parseRss } from "@/lib/rss";

export async function getPosts(): Promise<{ posts: Post[]; source: "live" | "fallback" }> {
  "use cache";
  cacheLife("hours");
  cacheTag("writing");

  try {
    const response = await fetch(site.writing.feedUrl, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "KritiSite/1.0",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`feed ${response.status}`);
    const posts = parseRss(await response.text()).slice(0, 4);
    if (posts.length === 0) throw new Error("feed empty");
    return { posts, source: "live" };
  } catch (error) {
    console.error("[writing] using saved letters", error);
    return { posts: [...site.writing.fallbackPosts], source: "fallback" };
  }
}
