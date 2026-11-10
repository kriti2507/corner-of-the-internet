"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { External } from "@/components/external";
import type { WritingTopic } from "@/content/site";
import { formatDay, formatPostDate } from "@/lib/format";

export type WritingItem = {
  id: string;
  kind: "letter" | "note";
  title: string;
  href: string;
  external: boolean;
  date: string;
  summary: string;
  sample: boolean;
  topic: string;
  likes: number;
  comments: number;
  restacks: number;
  words: number;
  rank: number | null;
};

type View = { id: string; label: string; hint?: string };

type Copy = {
  groupBy: string;
  jumpTo: string;
  topHead: string;
  topBlurb: string;
  restHead: string;
  restBlurb: string;
  noStats: string;
  year: string;
};

type Cluster = {
  id: string;
  kicker: string;
  name: string;
  blurb: string;
  tone: WritingTopic["tone"];
  items: WritingItem[];
  featured?: boolean;
  big?: boolean;
};

const newestFirst = (a: WritingItem, b: WritingItem) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
const oldestFirst = (a: WritingItem, b: WritingItem) => -newestFirst(a, b);
const engagement = (item: WritingItem) => item.likes + item.comments + item.restacks;

function count(n: number, one: string) {
  return `${n} ${n === 1 ? one : `${one}s`}`;
}

function byTopic(items: WritingItem[], topics: WritingTopic[]): Cluster[] {
  return topics
    .map((topic) => {
      const inTopic = items.filter((item) => item.topic === topic.id);
      inTopic.sort(topic.order === "oldest" ? oldestFirst : newestFirst);
      const noun = topic.id === "journal" ? "note" : "letter";
      return {
        id: topic.id,
        kicker: count(inTopic.length, noun),
        name: topic.name,
        blurb: topic.blurb,
        tone: topic.tone,
        items: inTopic,
      };
    })
    .filter((cluster) => cluster.items.length > 0);
}

function byYear(items: WritingItem[], oldest: boolean, copy: Copy): Cluster[] {
  const sorted = [...items].sort(oldest ? oldestFirst : newestFirst);
  const years: Cluster[] = [];
  for (const item of sorted) {
    const year = item.date.slice(0, 4);
    let cluster = years.find((entry) => entry.id === year);
    if (!cluster) {
      cluster = { id: year, kicker: copy.year, name: year, blurb: "", tone: "paper", items: [], big: true };
      years.push(cluster);
    }
    cluster.items.push(item);
  }
  for (const cluster of years) cluster.blurb = count(cluster.items.length, "piece");
  return years;
}

function byRank(items: WritingItem[], copy: Copy, journal: WritingTopic): Cluster[] {
  // Public numbers first; Substack's own "top" order breaks ties.
  const order = items
    .filter((item) => item.kind === "letter")
    .sort(
      (a, b) =>
        engagement(b) - engagement(a) ||
        (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER) ||
        newestFirst(a, b),
    );
  const notes = items.filter((item) => item.kind === "note").sort(newestFirst);
  const clusters: Cluster[] = [
    { id: "top-3", kicker: "Top 3", name: copy.topHead, blurb: copy.topBlurb, tone: "yellow", items: order.slice(0, 3), featured: true },
    { id: "top-rest", kicker: count(order.length - 3, "letter"), name: copy.restHead, blurb: copy.restBlurb, tone: "paper", items: order.slice(3) },
    { id: journal.id, kicker: count(notes.length, "note"), name: journal.name, blurb: journal.blurb, tone: journal.tone, items: notes },
  ];
  return clusters.filter((cluster) => cluster.items.length > 0);
}

const VIEW_EVENT = "writing-view";

function subscribeToView(onChange: () => void) {
  window.addEventListener(VIEW_EVENT, onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener(VIEW_EVENT, onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function readView() {
  return new URLSearchParams(window.location.search).get("view");
}

function Card({ item, showRank, position }: { item: WritingItem; showRank: boolean; position: number }) {
  const minutes = item.words ? Math.max(1, Math.round(item.words / 230)) : 0;
  const stats = [
    item.likes ? `♥ ${item.likes}` : "",
    item.comments ? count(item.comments, "comment") : "",
    item.restacks ? count(item.restacks, "restack") : "",
  ].filter(Boolean);
  const body = (
    <>
      {showRank ? (
        <span className="w-rank" aria-label={`Number ${position}`}>
          {position}
        </span>
      ) : null}
      <span className="w-meta">
        {item.kind === "note" ? <span className="w-tag">{item.sample ? "Sample" : "On this site"}</span> : null}
        <time dateTime={item.date}>{item.kind === "note" ? formatDay(item.date) : formatPostDate(item.date)}</time>
        {minutes ? <span>· {minutes} min read</span> : null}
      </span>
      <h3>{item.title}</h3>
      {item.summary ? <p>{item.summary}</p> : null}
      <span className="w-foot">
        <span className="w-stats">{stats.join(" · ")}</span>
        <span className="w-arrow" aria-hidden="true">
          {item.external ? "↗" : "→"}
        </span>
      </span>
    </>
  );
  return item.external ? (
    <External className="w-card" href={item.href}>
      {body}
    </External>
  ) : (
    <Link className="w-card" href={item.href}>
      {body}
    </Link>
  );
}

export function WritingIndex({
  kicker,
  title,
  lede,
  publicationUrl,
  allLabel,
  items,
  topics,
  views,
  copy,
  hasStats,
  fallbackNote,
}: {
  kicker: string;
  title: string;
  lede: string;
  publicationUrl: string;
  allLabel: string;
  items: WritingItem[];
  topics: WritingTopic[];
  views: readonly View[];
  copy: Copy;
  hasStats: boolean;
  fallbackNote: string | null;
}) {
  const defaultView = views[0]?.id ?? "topic";
  // The grouping lives in ?view= so a shared link opens the same way.
  const wanted = useSyncExternalStore(subscribeToView, readView, () => null);
  const view = wanted && views.some((option) => option.id === wanted) ? wanted : defaultView;

  function choose(id: string) {
    const url = new URL(window.location.href);
    if (id === defaultView) url.searchParams.delete("view");
    else url.searchParams.set("view", id);
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(VIEW_EVENT));
  }

  const journal = topics.find((topic) => topic.id === "journal") ?? topics[topics.length - 1];
  const clusters = useMemo(() => {
    if (view === "top" && hasStats) return byRank(items, copy, journal);
    if (view === "top" || view === "newest") return byYear(items, false, copy);
    if (view === "oldest") return byYear(items, true, copy);
    return byTopic(items, topics);
  }, [view, items, topics, copy, hasStats, journal]);

  const ranked = view === "top" && hasStats;
  const positions = useMemo(() => {
    const map = new Map<string, number>();
    if (!ranked) return map;
    for (const item of clusters.flatMap((cluster) => cluster.items)) {
      if (item.kind === "letter") map.set(item.id, map.size + 1);
    }
    return map;
  }, [clusters, ranked]);

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

        <div className="w-controls">
          <div className="w-switch" role="group" aria-label={copy.groupBy}>
            <span className="w-switch-label">{copy.groupBy}</span>
            {views.map((option) => (
              <button
                key={option.id}
                type="button"
                className="chip"
                aria-pressed={view === option.id}
                title={option.hint}
                onClick={() => choose(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Link className="w-journal" href="/blog">
            The journal →
          </Link>
        </div>

        {view === "topic" && clusters.length > 1 ? (
          <nav className="w-jump" aria-label={copy.jumpTo}>
            {clusters.map((cluster) => (
              <a key={cluster.id} href={`#c-${cluster.id}`} className={`w-jump-link tone-${cluster.tone}`}>
                {cluster.name} <span>{cluster.items.length}</span>
              </a>
            ))}
          </nav>
        ) : null}

        {fallbackNote ? <p className="quiet-note">{fallbackNote}</p> : null}
        {view === "top" && !hasStats ? <p className="quiet-note">{copy.noStats}</p> : null}

        <div className="w-clusters" key={view}>
          {clusters.map((cluster) => (
            <section
              key={cluster.id}
              id={`c-${cluster.id}`}
              className={`w-cluster tone-${cluster.tone}${cluster.featured ? " is-featured" : ""}`}
              aria-labelledby={`h-${cluster.id}`}
            >
              <header className="w-cluster-head">
                <p className="card-kicker">{cluster.kicker}</p>
                <h2 id={`h-${cluster.id}`} className={cluster.big ? "is-big" : undefined}>
                  {cluster.name}
                </h2>
                {cluster.blurb ? <p>{cluster.blurb}</p> : null}
              </header>
              <ul className="w-grid">
                {cluster.items.map((item) => (
                  <li key={item.id}>
                    <Card item={item} showRank={positions.has(item.id)} position={positions.get(item.id) ?? 0} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
