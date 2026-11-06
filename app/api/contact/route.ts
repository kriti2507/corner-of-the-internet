const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= 8) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Send that as JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "That note was empty." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  if (clean(data.website, 200)) {
    return Response.json({ ok: true, delivered: false });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return Response.json(
      { ok: false, error: "Too many notes from here. Try again in a little while." },
      { status: 429 },
    );
  }

  const name = clean(data.name, 80);
  const email = clean(data.email, 120);
  const company = clean(data.company, 120);
  const message = clean(data.message, 4000);
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "That email doesn't look right.";
  if (message.length < 10) errors.message = "Tell me a little more.";
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  const note = {
    name,
    email,
    company: company || null,
    message,
  };

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!key) {
    console.info("[contact] logged without email delivery", note);
    return Response.json({ ok: true, delivered: false });
  }
  if (!to || !from) {
    console.error("[contact] RESEND_API_KEY is set but CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is missing");
    return Response.json(
      { ok: false, error: "Mail isn't fully configured yet." },
      { status: 500 },
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Let's talk — ${name}`,
      text: [`From: ${name} <${email}>`, company ? `Company: ${company}` : null, "", message]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!response.ok) {
    console.error("[contact] resend failed", response.status);
    return Response.json({ ok: false, error: "The mail service didn't accept that." }, { status: 502 });
  }

  return Response.json({ ok: true, delivered: true });
}
