"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Topic = { value: string; label: string };

type Fields = {
  name: string;
  email: string;
  topic: string;
  message: string;
  company: string;
  website: string;
};

const empty: Fields = { name: "", email: "", topic: "product", message: "", company: "", website: "" };

export function ContactForm({
  kicker,
  title,
  lede,
  services = [],
  topics,
  submit,
  sending,
  successTitle,
  successBody,
  errorFallback,
  email,
}: {
  kicker: string;
  title: string;
  lede: string;
  services?: readonly { title: string; body: string }[];
  topics: readonly Topic[];
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorFallback: string;
  email: string;
}) {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formError, setFormError] = useState("");

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
    <section className="band" id="note" aria-labelledby="note-heading">
      <div className="wrap contact-layout">
        <div>
          <p className="script kicker">{kicker}</p>
          <h2 id="note-heading">{title}</h2>
          <p className="lede">{lede}</p>
          {services.length > 0 ? (
            <ul className="point-list">
              {services.map((service) => (
                <li key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.body}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="form-card">
          {status === "sent" ? (
            <div className="success-note" role="status">
              <p className="script success-title">{successTitle}</p>
              <p>{successBody}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
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
                <Label htmlFor="topic">What do you need?</Label>
                <select
                  id="topic"
                  name="topic"
                  className="select"
                  value={fields.topic}
                  aria-invalid={errors.topic ? true : undefined}
                  onChange={(event) => set("topic", event.target.value)}
                >
                  {topics.map((topic) => (
                    <option key={topic.value} value={topic.value}>
                      {topic.label}
                    </option>
                  ))}
                </select>
                {errors.topic ? <p className="field-error">{errors.topic}</p> : null}
              </div>
              <div className="field">
                <Label htmlFor="message">Note</Label>
                <Textarea
                  id="message"
                  name="message"
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
                  {formError}{" "}
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              ) : null}
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? sending : submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
