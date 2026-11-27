"use client";

import { useEffect, useState } from "react";

type Row = { id: string; key: string; name: string; text: string; createdAt: string; kriti?: boolean; url: string; title: string; path: string };

const API = "/coffee/api/admin/comments";

export function AdminPanel() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [replying, setReplying] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("coffee-admin");
      if (saved) setToken(saved);
    } catch {}
  }, []);

  async function call(method: string, body?: unknown) {
    const res = await fetch(API, {
      method,
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
    return data;
  }

  async function load() {
    setError(null);
    try {
      const data = await call("GET");
      setRows(data.comments);
      try {
        sessionStorage.setItem("coffee-admin", token);
      } catch {}
    } catch (e) {
      setRows(null);
      setError((e as Error).message);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete the note from ${row.name}? This can't be undone.`)) return;
    try {
      await call("DELETE", { url: row.url, key: row.key });
      setRows((current) => current?.filter((r) => r.url !== row.url) ?? null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function reply(event: React.FormEvent<HTMLFormElement>, row: Row) {
    event.preventDefault();
    const text = new FormData(event.currentTarget).get("text");
    try {
      await call("POST", { key: row.key, text });
      setReplying(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <>
      <form
        className="note-form"
        style={{ maxWidth: 420 }}
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <div>
          <label htmlFor="admin-token">Admin password</label>
          <input id="admin-token" type="password" value={token} onChange={(e) => setToken(e.target.value)} autoComplete="current-password" />
        </div>
        <button className="btn" type="submit">
          Open the notebook
        </button>
        {error && (
          <p className="note-status" data-tone="error" role="alert">
            {error}
          </p>
        )}
      </form>

      {rows && (
        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>From</th>
              <th>Note</th>
              <th>When</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5}>No notes yet.</td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.url}>
                <td>
                  <a href={row.path} target="_blank" rel="noreferrer">
                    {row.title}
                  </a>
                </td>
                <td>{row.kriti ? "Kriti (you)" : row.name}</td>
                <td className="text">
                  {row.text}
                  {replying === row.url && (
                    <form onSubmit={(e) => reply(e, row)} style={{ marginTop: "0.6rem", display: "grid", gap: "0.4rem" }}>
                      <textarea name="text" required rows={3} style={{ width: "100%", font: "inherit" }} aria-label="Your reply" />
                      <button className="small-btn" type="submit">
                        Post reply
                      </button>
                    </form>
                  )}
                </td>
                <td>{new Date(row.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Tokyo" })}</td>
                <td>
                  <div className="row-actions">
                    <button className="small-btn" type="button" onClick={() => setReplying(replying === row.url ? null : row.url)}>
                      Reply
                    </button>
                    <button className="small-btn danger" type="button" onClick={() => remove(row)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
