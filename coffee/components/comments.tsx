"use client";

import { useEffect, useRef, useState } from "react";

type Note = { id: string; name: string; text: string; createdAt: string; kriti?: boolean };

const API = "/coffee/api/comments";

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Tokyo" });
}

/**
 * The café notebook at the bottom of every page. Anyone can leave a note
 * without an account. Notes appear straight away; Kriti can remove them
 * from /coffee/admin.
 */
export function Comments({ pageKey, title }: { pageKey: string; title: string }) {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [sending, setSending] = useState(false);
  const started = useRef(Date.now());

  useEffect(() => {
    let live = true;
    fetch(`${API}?key=${encodeURIComponent(pageKey)}`)
      .then((res) => res.json())
      .then((data: { enabled: boolean; comments: Note[] }) => {
        if (!live) return;
        setEnabled(data.enabled);
        setNotes(data.comments ?? []);
      })
      .catch(() => live && setNotes([]));
    return () => {
      live = false;
    };
  }, [pageKey]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          key: pageKey,
          name: data.get("name"),
          text: data.get("text"),
          website: data.get("website"),
          elapsed: Date.now() - started.current,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ tone: "error", text: body.error ?? "Your note didn't save. Try again in a minute." });
        return;
      }
      setNotes((current) => [...(current ?? []), body.comment]);
      form.reset();
      setStatus({ tone: "ok", text: "Your note is in the notebook." });
    } catch {
      setStatus({ tone: "error", text: "Couldn't reach the notebook. Check your connection and try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="notebook" aria-labelledby="notebook-heading">
      <div className="notebook-head">
        <h2 id="notebook-heading">The café notebook</h2>
        <p>Had {title}? Disagree with the rating? Know somewhere better? Leave a note.</p>
      </div>
      <div className="notebook-page">
        {notes === null ? (
          <p className="note-empty">Opening the notebook…</p>
        ) : notes.length === 0 ? (
          <p className="note-empty">No notes yet. Yours can be the first.</p>
        ) : (
          <ol className="notes-list">
            {notes.map((note) => (
              <li key={note.id} className="note" data-kriti={note.kriti || undefined}>
                <div className="note-by">
                  <strong>{note.name}</strong>
                  {note.kriti && <span className="note-kriti">Kriti</span>}
                  <time dateTime={note.createdAt}>{when(note.createdAt)}</time>
                </div>
                <p className="note-text">{note.text}</p>
              </li>
            ))}
          </ol>
        )}

        {enabled ? (
          <form className="note-form" onSubmit={submit}>
            <div>
              <label htmlFor={`text-${pageKey}`}>Your note</label>
              <textarea id={`text-${pageKey}`} name="text" required maxLength={1200} placeholder="Tried this one too…" />
            </div>
            <div className="row">
              <div>
                <label htmlFor={`name-${pageKey}`}>Your name</label>
                <input id={`name-${pageKey}`} name="name" required maxLength={60} autoComplete="nickname" />
              </div>
              <button className="btn" type="submit" disabled={sending}>
                {sending ? "Adding…" : "Add your note"}
              </button>
            </div>
            <div className="hp" aria-hidden="true">
              <label htmlFor={`website-${pageKey}`}>Leave this empty</label>
              <input id={`website-${pageKey}`} name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <p className="hint">Your name and note show on this page. No email needed.</p>
            {status && (
              <p className="note-status" data-tone={status.tone} role="status">
                {status.text}
              </p>
            )}
          </form>
        ) : (
          <p className="hint" style={{ marginTop: "1rem" }}>
            The notebook opens for new notes once comments are switched on for this site.
          </p>
        )}
      </div>
    </section>
  );
}
