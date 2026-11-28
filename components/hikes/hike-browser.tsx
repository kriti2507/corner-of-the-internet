"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HikePolaroid } from "@/components/hikes/hike-card";
import { JapanMap } from "@/components/weekends/japan-map";
import type { Hike } from "@/lib/hikes";
import { formatDay, formatDuration, formatMeters } from "@/lib/format";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PIN = "#4f8a73";

export function HikeBrowser({ hikes }: { hikes: Hike[] }) {
  const newestFirst = useMemo(() => [...hikes].reverse(), [hikes]);
  const numberOf = useMemo(() => new Map(hikes.map((hike, index) => [hike.slug, index + 1])), [hikes]);
  const [region, setRegion] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(newestFirst[0]?.slug ?? "");

  const regions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const hike of hikes) counts.set(hike.region, (counts.get(hike.region) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [hikes]);

  const shown = newestFirst.filter((hike) => !region || hike.region === region);
  const pick = shown.find((hike) => hike.slug === selected) ?? shown[0] ?? newestFirst[0];

  const months = useMemo(() => {
    const groups: { key: string; label: string; hikes: Hike[] }[] = [];
    for (const hike of shown) {
      const key = hike.date.slice(0, 7);
      let group = groups[groups.length - 1];
      if (!group || group.key !== key) {
        const [year, month] = key.split("-");
        group = { key, label: `${MONTHS[Number(month) - 1]} ${year}`, hikes: [] };
        groups.push(group);
      }
      group.hikes.push(hike);
    }
    return groups;
  }, [shown]);

  function chooseRegion(next: string | null) {
    setRegion(next);
    const first = newestFirst.find((hike) => !next || hike.region === next);
    if (first) setSelected(first.slug);
  }

  function choosePin(slug: string) {
    setSelected(slug);
    const card = document.getElementById(`hike-${slug}`);
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <>
      <div className="wk-filters sb-filters" role="toolbar" aria-label="Region">
        <button type="button" className="wk-filter" aria-pressed={region === null} onClick={() => chooseRegion(null)}>
          All of Japan <span className="wk-count">{hikes.length}</span>
        </button>
        {regions.map(([name, count]) => (
          <button
            key={name}
            type="button"
            className="wk-filter"
            aria-pressed={region === name}
            onClick={() => chooseRegion(region === name ? null : name)}
          >
            {name} <span className="wk-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="sb-browse">
        <div className="sb-browse-side">
          <JapanMap
            label="Map of the hikes shown"
            caption="Tap a pin to find the hike."
            activeId={pick?.slug ?? null}
            onSelect={choosePin}
            points={shown
              .filter((hike) => hike.lat != null && hike.lng != null)
              .map((hike) => ({
                id: hike.slug,
                lat: hike.lat as number,
                lng: hike.lng as number,
                label: `${hike.title}, ${hike.region}, ${formatDay(hike.date)}`,
                color: PIN,
              }))}
          />
          {pick ? (
            <article className="sb-note-card" aria-live="polite">
              <p className="script sb-note-kicker">pinned</p>
              <h3>{pick.title}</h3>
              <p>
                {pick.region} · <time dateTime={pick.date}>{formatDay(pick.date)}</time>
              </p>
              <p>
                Summit <b>{formatMeters(pick.heightM)}</b>, climbed <b>{formatMeters(pick.climbedM)}</b>
                {pick.durationMin != null ? (
                  <>
                    , <b>{formatDuration(pick.durationMin)}</b> on the trail
                  </>
                ) : null}
                .
              </p>
              <Link className="wk-link" href={`/hikes/${pick.slug}`}>
                The trail page →
              </Link>
            </article>
          ) : null}
        </div>

        <div className="sb-months">
          {months.map((group) => (
            <section key={group.key} className="sb-month" aria-labelledby={`month-${group.key}`}>
              <h2 id={`month-${group.key}`} className="sb-month-head">
                <span className="script">{group.label}</span>
                <small>
                  {group.hikes.length} {group.hikes.length === 1 ? "hike" : "hikes"}
                </small>
              </h2>
              <ul className="sb-polaroid-grid">
                {group.hikes.map((hike) => (
                  <li key={hike.slug} onMouseEnter={() => setSelected(hike.slug)}>
                    <HikePolaroid
                      hike={hike}
                      index={shown.indexOf(hike)}
                      number={numberOf.get(hike.slug)}
                      active={hike.slug === pick?.slug}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
