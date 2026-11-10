"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Fields = {
  name: string;
  email: string;
  message: string;
  company: string;
  website: string;
};

const empty: Fields = { name: "", email: "", message: "", company: "", website: "" };

export function ContactForm({
  kicker,
  title,
  lede,
  offers,
  closer,
  aboutCta,
  messageLabel,
  submit,
  sending,
  successTitle,
  successBody,
  errorFallback,
  email,
  perks,
}: {
  kicker: string;
  title: string;
  lede: string;
  offers: readonly { label: string; body: string }[];
  closer: string;
  aboutCta: { label: string; href: string };
  messageLabel: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorFallback: string;
  email: string;
  /** Message to pre-fill when the page is opened with ?perk=<key>. */
  perks: Record<string, string>;
}) {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formError, setFormError] = useState("");

  // A hero secret links to /?perk=<key>#note. Pre-fill the message once.
  // The query stays in the URL: rewriting it makes the router re-render the page.
  useEffect(() => {
    const perk = new URLSearchParams(window.location.search).get("perk");
    if (!perk) return;
    const text = perks[perk];
    if (!text) return;
    // After hydration, so the server and client render the same empty form.
    const frame = window.requestAnimationFrame(() =>
      setFields((current) => (current.message ? current : { ...current, message: text })),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [perks]);

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setFormError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
      };
      if (!response.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.error || errorFallback);
        setStatus("error");
        return;
      }
      setStatus("sent");
      setFields(empty);
    } catch {
      setFormError(errorFallback);
      setStatus("error");
    }
  }

  return (
    <div className="talk">
      <div className="wrap talk-layout">
        <div className="talk-copy">
          <p className="script talk-kicker">{kicker}</p>
          <h2 id="talk-heading">{title}</h2>
          <p className="lede">{lede}</p>
          <ul className="talk-offers">
            {offers.map((offer) => (
              <li key={offer.label}>
                <strong>{offer.label}</strong>
                <span>{offer.body}</span>
              </li>
            ))}
          </ul>
          <p className="talk-closer">{closer}</p>
          <Link className="btn btn-ghost" href={aboutCta.href}>
            {aboutCta.label}
          </Link>
        </div>
        <div className="form-card">
          {status === "sent" ? (
            <div className="success-note" role="status">
              <p className="script success-title">{successTitle}</p>
              <p>{successBody}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-labelledby="talk-heading">
              <div className="field">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={fields.name}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onChange={(event) => set("name", event.target.value)}
                  required
                />
                {errors.name ? (
                  <p id="name-error" className="field-error">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div className="field">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={fields.email}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onChange={(event) => set("email", event.target.value)}
                  required
                />
                {errors.email ? (
                  <p id="email-error" className="field-error">
                    {errors.email}
                  </p>
                ) : null}
              </div>
              <div className="field">
                <Label htmlFor="company">Company, if you have one</Label>
                <Input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  value={fields.company}
                  onChange={(event) => set("company", event.target.value)}
                />
              </div>
              <div className="field">
                <Label htmlFor="message">{messageLabel}</Label>
                <Textarea
                  id="message"
                  name="message"
                  className="min-h-20"
                  value={fields.message}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  onChange={(event) => set("message", event.target.value)}
                  required
                />
                {errors.message ? (
                  <p id="message-error" className="field-error">
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <div className="hp" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={fields.website}
                  onChange={(event) => set("website", event.target.value)}
                />
              </div>
              {formError ? (
                <p className="field-error" role="alert">
                  {formError} <a href={`mailto:${email}`}>{email}</a>
                </p>
              ) : null}
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? sending : submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
