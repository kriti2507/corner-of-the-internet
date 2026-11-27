import { after } from "next/server";
import { addComment, clean, commentsEnabled, getComments, isValidKey, notify, rateLimited } from "@/lib/comments";
import { pathForKey, titleForKey } from "@/lib/content";

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  if (!isValidKey(key)) return Response.json({ error: "Unknown page." }, { status: 404 });
  const comments = await getComments(key);
  return Response.json(
    { enabled: commentsEnabled(), comments },
    { headers: { "cache-control": "public, s-maxage=10, stale-while-revalidate=30" } },
  );
}

export async function POST(request: Request) {
  if (!commentsEnabled()) return Response.json({ error: "Comments aren't switched on yet." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !isValidKey(body.key)) return Response.json({ error: "Unknown page." }, { status: 400 });

  const name = clean(body.name, 60);
  const text = clean(body.text, 1200);

  // Bots fill the hidden field or submit instantly. Pretend it worked.
  if (clean(body.website, 200) || (typeof body.elapsed === "number" && body.elapsed < 2500)) {
    return Response.json({ comment: { id: "x", key: body.key, name, text, createdAt: new Date().toISOString() } });
  }
  if (!name) return Response.json({ error: "Add your name so Kriti knows who wrote it." }, { status: 400 });
  if (text.length < 2) return Response.json({ error: "Write a note first." }, { status: 400 });
  if (/\bkriti\b/i.test(name)) return Response.json({ error: "Pick a different name. That one is Kriti's." }, { status: 400 });
  if ((text.match(/https?:\/\//g) ?? []).length > 2) {
    return Response.json({ error: "Notes can have two links at most." }, { status: 400 });
  }

  const visitor = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (rateLimited(visitor)) {
    return Response.json({ error: "That's a lot of notes at once. Try again in ten minutes." }, { status: 429 });
  }

  const comment = await addComment({ key: body.key, name, text });
  after(() => notify(comment, titleForKey(comment.key) ?? comment.key, pathForKey(comment.key)));
  return Response.json({ comment }, { status: 201 });
}
