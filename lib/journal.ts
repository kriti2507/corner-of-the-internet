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
  /** `sakana: true` puts the note in the Sakana App notes (/sakana). */
  sakana: boolean;
  /** Tie-breaker for notes that share a date: lower comes first. */
  order: number | null;
  /** Rough reading time in minutes. */
  minutes: number;
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
      .map((part) => unquote(part.trim()))
      .filter(Boolean);
  }
  return unquote(value);
}

/** Strip one pair of matching wrapping quotes, so a title that ends in a quote keeps it. */
function unquote(value: string): string {
  const first = value[0];
  if (value.length >= 2 && (first === '"' || first === "'") && value.endsWith(first)) {
    return value.slice(1, -1);
  }
  return value;
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
        sakana: data.sakana === true,
        order: Number.isFinite(Number(asString(data.order))) && asString(data.order) ? Number(asString(data.order)) : null,
        minutes: Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220)),
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

/** Oldest first: by date, then `order` for notes written the same day. */
function readingOrder(a: JournalPost, b: JournalPost) {
  const byDate = a.date.localeCompare(b.date);
  if (byDate !== 0) return byDate;
  return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
}

export type SakanaNote = JournalPost & { number: number };

/** Sakana App notes, newest first, each with its number (No. 1 is the first ever written). */
export function sakanaNotes(): SakanaNote[] {
  return getJournalPosts()
    .filter((post) => post.sakana)
    .sort(readingOrder)
    .map((post, index) => ({ ...post, number: index + 1 }))
    .reverse();
}
