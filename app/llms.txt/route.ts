import { getPlaces, kindLabel, placeWhere } from "@/content/places";
import { site } from "@/content/site";
import { getJournalPosts } from "@/lib/journal";
import { absolute } from "@/lib/structured-data";

/**
 * /llms.txt — a plain-text map of the site for AI assistants
 * (the llmstxt.org convention). Built from the same content as the pages.
 */
export function GET() {
  const posts = getJournalPosts();
  const places = getPlaces();

  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Contact: ${site.email}. Based in Tokyo, Japan.`,
    "",
    "## Pages",
    `- [Home](${absolute("/")}): Sakana work, AI Noodle, Women x Tech meetups, Small Wins, and working together`,
    `- [Writing](${absolute("/writing")}): AI Noodle letters from Substack and notes on this site`,
    `- [Places](${absolute("/places")}): cafés, matcha, onsen, gardens and trips in Japan, from places I've visited`,
    `- [Hikes](${absolute("/hikes")}): every hike I've logged in Japan, on a map`,
    `- [Reading](${absolute("/books")}): books I've read`,
    `- [Japanese](${absolute("/japanese")}): learning Japanese toward JLPT N1`,
    `- [About](${absolute("/about")})`,
  ];

  if (posts.length > 0) {
    lines.push("", "## Notes and guides");
    for (const post of posts) {
      lines.push(`- [${post.title}](${absolute(`/blog/${post.slug}`)})${post.summary ? `: ${post.summary}` : ""}`);
    }
  }

  lines.push("", "## Places in Japan");
  for (const place of places) {
    lines.push(`- [${place.name}](${absolute(`/places/${place.slug}`)}): ${kindLabel(place.kind)} in ${placeWhere(place)}`);
  }

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
