import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Everyone may read the site, including AI answer engines (ChatGPT,
 * Perplexity, Claude, Google's AI answers). Being readable is how the
 * Tokyo guides end up cited in answers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
