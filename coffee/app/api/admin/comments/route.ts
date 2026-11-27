import { addComment, checkAdmin, clean, commentsEnabled, getAllComments, isValidKey, removeComment } from "@/lib/comments";
import { pathForKey, titleForKey } from "@/lib/content";

const denied = () => Response.json({ error: "Wrong password." }, { status: 401 });

export async function GET(request: Request) {
  if (!checkAdmin(request)) return denied();
  const comments = (await getAllComments()).map((comment) => ({
    ...comment,
    title: titleForKey(comment.key) ?? comment.key,
    path: `/coffee${pathForKey(comment.key)}`,
  }));
  return Response.json({ enabled: commentsEnabled(), comments }, { headers: { "cache-control": "no-store" } });
}

/** Reply as Kriti. */
export async function POST(request: Request) {
  if (!checkAdmin(request)) return denied();
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || !isValidKey(body.key)) return Response.json({ error: "Unknown page." }, { status: 400 });
  const text = clean(body.text, 2000);
  if (!text) return Response.json({ error: "Write a reply first." }, { status: 400 });
  const comment = await addComment({ key: body.key, name: "Kriti", text, kriti: true });
  return Response.json({ comment }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!checkAdmin(request)) return denied();
  const body = (await request.json().catch(() => null)) as { url?: string; key?: string } | null;
  if (!body?.url || !isValidKey(body.key) || !/\.blob\.vercel-storage\.com\/comments\//.test(body.url)) {
    return Response.json({ error: "That isn't a comment." }, { status: 400 });
  }
  await removeComment(body.url, body.key);
  return Response.json({ ok: true });
}
