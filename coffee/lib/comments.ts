import "server-only";
import crypto from "node:crypto";
import { del, list, put } from "@vercel/blob";
import { revalidateTag, unstable_cache } from "next/cache";
import { commentKeys } from "./content";

/**
 * Comments live in Vercel Blob, one small JSON file per note:
 *
 *   comments/<type>/<slug>/<timestamp>-<id>.json
 *
 * Files are never edited, only added or deleted, so a cached copy is never
 * wrong. Each page's list is cached and refreshed the moment a note is added
 * or removed. No commenter emails or IP addresses are stored.
 */

export type StoredComment = {
  id: string;
  key: string;
  name: string;
  text: string;
  createdAt: string;
  kriti?: boolean;
};

export type AdminComment = StoredComment & { pathname: string; url: string };

export const commentsEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export function isValidKey(key: unknown): key is string {
  return typeof key === "string" && commentKeys().includes(key);
}

const prefixFor = (key: string) => `comments/${key.replace(":", "/")}/`;
const tagFor = (key: string) => `comments:${key}`;

async function readAll(prefix: string): Promise<AdminComment[]> {
  const blobs: { url: string; pathname: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && blobs.length < 5000);

  const notes = await Promise.all(
    blobs.map(async (blob) => {
      try {
        const res = await fetch(blob.url, { cache: "no-store" });
        if (!res.ok) return null;
        const data = (await res.json()) as StoredComment;
        return { ...data, pathname: blob.pathname, url: blob.url };
      } catch {
        return null;
      }
    }),
  );
  return notes.filter((note): note is AdminComment => note !== null).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getComments(key: string): Promise<StoredComment[]> {
  if (!commentsEnabled()) return [];
  const cached = unstable_cache(
    async () => (await readAll(prefixFor(key))).map(({ id, name, text, createdAt, kriti }) => ({ id, key, name, text, createdAt, kriti })),
    ["comments", key],
    { tags: [tagFor(key)], revalidate: 60 * 60 * 24 },
  );
  return cached();
}

export async function getAllComments() {
  if (!commentsEnabled()) return [];
  return (await readAll("comments/")).reverse();
}

export async function addComment(input: { key: string; name: string; text: string; kriti?: boolean }) {
  const createdAt = new Date().toISOString();
  const id = crypto.randomBytes(6).toString("hex");
  const comment: StoredComment = { id, key: input.key, name: input.name, text: input.text, createdAt, ...(input.kriti ? { kriti: true } : {}) };
  await put(`${prefixFor(input.key)}${createdAt.replace(/[:.]/g, "-")}-${id}.json`, JSON.stringify(comment), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
  revalidateTag(tagFor(input.key), { expire: 0 });
  return comment;
}

export async function removeComment(url: string, key: string) {
  await del(url);
  revalidateTag(tagFor(key), { expire: 0 });
}

/* ---------- Spam guards ---------- */

const recent = new Map<string, number[]>();

/** At most 5 notes per visitor per 10 minutes, per server instance. */
export function rateLimited(visitor: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const hits = (recent.get(visitor) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  recent.set(visitor, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > 5;
}

export function clean(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export function checkAdmin(request: Request) {
  const token = process.env.ADMIN_TOKEN;
  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!token || !given) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(given);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Optional email to Kriti, through the same Resend account as the main site. */
export async function notify(comment: StoredComment, title: string, path: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.COMMENTS_NOTIFY_EMAIL;
  if (!key || !to) return;
  const from = process.env.COMMENTS_FROM_EMAIL ?? "Coffee notebook <ping@heykriti.com>";
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject: `New note on ${title}`,
      text: `${comment.name} wrote:\n\n${comment.text}\n\nhttps://heykriti.com/coffee${path}\nModerate: https://heykriti.com/coffee/admin`,
    }),
  }).catch(() => undefined);
}
