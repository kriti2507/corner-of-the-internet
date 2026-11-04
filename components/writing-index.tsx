"use client";

import Link from "next/link";
import { useState } from "react";
import { External } from "@/components/external";
import { formatDay, formatPostDate } from "@/lib/format";

type SiteCard = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  external: string | null;
  sample: boolean;
};

type NoodleCard = {
  title: string;
  url: string;
  date: string;
  excerpt: string;
};

export function WritingIndex({
  kicker,
  title,
  lede,
  publicationUrl,
  allLabel,
  sitePosts,
  noodlePosts,
  source,
  fallbackNote,
  filters,
}: {
  kicker: string;
  title: string;
  lede: string;
  publicationUrl: string;
  allLabel: string;
  sitePosts: SiteCard[];
  noodlePosts: NoodleCard[];
  source: "live" | "fallback";
  fallbackNote: string;
  filters: { all: string; site: string; noodle: string };
}) {
  const [filter, setFilter] = useState<"all" | "site" | "noodle">("all");
  const externalUrls = new Set(sitePosts.flatMap((post) => (post.external ? [post.external] : [])));
  const noodle = noodlePosts.filter((post) => !externalUrls.has(post.url));
  const showSite = filter === "all" || filter === "site";
  const showNoodle = filter === "all" || filter === "noodle";

  return (
    <section className="band" aria-labelledby="writing-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <div className="section-head">
          <h1 id="writing-heading">{title}</h1>
          <External className="text-link" href={publicationUrl}>
            {allLabel}
          </External>
        </div>
        <p className="lede">{lede}</p>
        <div className="chips" role="toolbar" aria-label="Writing">
          {(
            [
              ["all", filters.all],
              ["site", filters.site],
              ["noodle", filters.noodle],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className="chip" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              {label}
            </button>
          ))}
        </div>
        <p className="note">
          <Link href="/blog">The journal →</Link>
        </p>
        {source === "fallback" && showNoodle ? <p className="quiet-note">{fallbackNote}</p> : null}
        <ul className="post-grid">
          {showSite
            ? sitePosts.map((post) => (
                <li key={post.slug}>
                  {post.external ? (
                    <a className="post-card" href={post.external} target="_blank" rel="noreferrer">
                      {post.sample ? <span className="card-kicker">Sample</span> : <span className="card-kicker">On this site</span>}
                      <time dateTime={post.date}>{formatDay(post.date)}</time>
                      <h3>{post.title}</h3>
                      {post.summary ? <p>{post.summary}</p> : null}
                      <span className="card-link">On Substack →</span>
                    </a>
                  ) : (
                    <Link className="post-card" href={`/blog/${post.slug}`}>
                      {post.sample ? <span className="card-kicker">Sample</span> : <span className="card-kicker">On this site</span>}
                      <time dateTime={post.date}>{formatDay(post.date)}</time>
                      <h3>{post.title}</h3>
                      {post.summary ? <p>{post.summary}</p> : null}
                      <span className="card-link">Read →</span>
                    </Link>
                  )}
                </li>
              ))
            : null}
          {showNoodle
            ? noodle.map((post) => (
                <li key={post.url}>
                  <a className="post-card" href={post.url} target="_blank" rel="noreferrer">
                    <span className="card-kicker">AI Noodle</span>
                    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                    <h3>{post.title}</h3>
                    {post.excerpt ? <p>{post.excerpt}</p> : null}
                    <span className="card-link">Read →</span>
                  </a>
                </li>
              ))
            : null}
        </ul>
      </div>
    </section>
  );
}
