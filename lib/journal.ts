import "server-only";

import fs from "fs";
import path from "path";

export type JournalPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cafes: string[];
  books: string[];
  hikes: string[];
  external: string | null;
  sample: boolean;
  draft: boolean;
  body: string;
};

function asList(value: string | boolean | string[] | undefined) {
  if (Array.isArray(value)) return value;
  return [];
}

function asString(value: string | boolean | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function parseValue(raw: string): string | boolean | string[] {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(",")
      .map((part) => part.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }
  return value.replace(/^['"]|['"]$/g, "");
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, string | boolean | string[]>, body: raw };
  const data: Record<string, string | boolean | string[]> = {};
  for (const line of match[1].split("\n")) {
    const cut = line.indexOf(":");
    if (cut < 1) continue;
    data[line.slice(0, cut).trim()] = parseValue(line.slice(cut + 1));
  }
  return { data, body: match[2].trim() };
}

function readPosts(): JournalPost[] {
  const dir = path.join(process.cwd(), "content/posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, file), "utf8"));
      return {
        slug,
        title: asString(data.title) || slug,
        date: asString(data.date),
        summary: asString(data.summary),
        tags: asList(data.tags),
        cafes: asList(data.cafes),
        books: asList(data.books),
        hikes: asList(data.hikes),
        external: asString(data.external) || null,
        sample: data.sample === true,
        draft: data.draft === true,
        body,
      };
    });
}

/** Published notes. `draft: true` stays out of the site. */
export function getJournalPosts() {
  return readPosts()
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getJournalPost(slug: string) {
  return getJournalPosts().find((post) => post.slug === slug) ?? null;
}

export function postsMentioning(kind: "cafes" | "books" | "hikes", slug: string) {
  return getJournalPosts().filter((post) => post[kind].includes(slug));
}
