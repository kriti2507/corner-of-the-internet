import type { Post } from "@/content/site";

function decode(input: string) {
  const cdata = input.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  return cdata
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
      String.fromCodePoint(parseInt(n, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? decode(match[1]).trim() : "";
}

function plain(html: string) {
  return decode(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(description: string, content: string) {
  const fromDescription = plain(description);
  const fromContent = plain(content);
  const source = fromDescription.length >= 12 ? fromDescription : fromContent || fromDescription;
  if (source.length <= 180) return source;
  return `${source.slice(0, 176).replace(/\s+\S*$/, "")}…`;
}

export function parseRss(xml: string): Post[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  const posts: Post[] = [];
  for (const item of items) {
    const title = plain(tag(item, "title"));
    const url = tag(item, "link").replace(/\s+/g, "");
    const pub = tag(item, "pubDate");
    const parsed = new Date(pub);
    if (!title || !url.startsWith("http") || Number.isNaN(parsed.getTime())) continue;
    posts.push({
      title,
      url,
      date: parsed.toISOString(),
      excerpt: excerpt(tag(item, "description"), tag(item, "content:encoded")),
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}
