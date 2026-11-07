"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { JapanMap } from "@/components/weekends/japan-map";
import type { Hike } from "@/lib/hikes";
import { formatDay, formatDuration, formatHours, formatMeters } from "@/lib/format";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PIN = "#4f8a73";

export function HikeLog({ hikes }: { hikes: Hike[] }) {
  const newestFirst = useMemo(() => [...hikes].reverse(), [hikes]);
  const [region, setRegion] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(newestFirst[0]?.slug ?? "");

  const totals = useMemo(() => {
    const minutes = hikes.reduce((sum, hike) => sum + (hike.durationMin ?? 0), 0);
    const highest = hikes.reduce((best, hike) => (hike.heightM > best.heightM ? hike : best), hikes[0]);
    return {
      climbed: hikes.reduce((sum, hike) => sum + hike.climbedM, 0),
      minutes,
      timed: hikes.filter((hike) => hike.durationMin != null).length,
      highest,
    };
  }, [hikes]);

  const regions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const hike of hikes) counts.set(hike.region, (counts.get(hike.region) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [hikes]);

  const shown = newestFirst.filter((hike) => !region || hike.region === region);
  const pick = shown.find((hike) => hike.slug === selected) ?? shown[0] ?? newestFirst[0];
  const maxClimbed = Math.max(1, ...hikes.map((hike) => hike.climbedM));

  const rows: ({ month: string } | { hike: Hike })[] = [];
  let lastMonth = "";
  for (const hike of shown) {
    const month = hike.date.slice(0, 7);
    if (month !== lastMonth) {
      rows.push({ month });
      lastMonth = month;
    }
    rows.push({ hike });
  }

  function chooseRegion(next: string | null) {
    setRegion(next);
    const first = newestFirst.find((hike) => !next || hike.region === next);
    if (first) setSelected(first.slug);
  }

  return (
    <>
      <dl className="wk-card wk-stats-strip">
        <div>
          <dt>hikes</dt>
          <dd className="wk-num">{hikes.length}</dd>
        </div>
        <div>
          <dt>metres climbed</dt>
          <dd className="wk-num">{formatMeters(totals.climbed)}</dd>
        </div>
        <div>
          <dt>
            on the trail, {totals.timed} of {hikes.length} timed
          </dt>
          <dd className="wk-num">{formatHours(totals.minutes)}</dd>
        </div>
        <div>
          <dt>highest summit, {totals.highest.title}</dt>
          <dd className="wk-num">{formatMeters(totals.highest.heightM)}</dd>
        </div>
      </dl>

      <div className="wk-filters" role="toolbar" aria-label="Region" style={{ marginBottom: "1.3rem" }}>
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

      <div className="wk-hike-layout">
        <div className="wk-hike-side">
          <JapanMap
            label="Map of the hikes shown"
            caption="Pins are placed by hand. Tap one to see the hike."
            activeId={pick?.slug ?? null}
            onSelect={setSelected}
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
            <article className="wk-card wk-hike-pick" aria-live="polite">
              <p className="wk-lane-name">
                {pick.region} · <time dateTime={pick.date}>{formatDay(pick.date)}</time>
              </p>
              <h2>{pick.title}</h2>
              <p style={{ margin: 0 }} className="wk-muted">
                Summit {formatMeters(pick.heightM)}, climbed {formatMeters(pick.climbedM)}
                {pick.durationMin != null ? `, ${formatDuration(pick.durationMin)} on the trail` : ""}.
              </p>
              <Link className="wk-link" href={`/hikes/${pick.slug}`}>
                The trail page →
              </Link>
            </article>
          ) : null}
        </div>

        <div className="wk-card wk-log-wrap">
          <table className="wk-log">
            <caption>Newest first. The bar shows metres climbed.</caption>
            <thead>
              <tr>
                <th scope="col">Mountain</th>
                <th scope="col" className="wk-hide-sm">
                  Region
                </th>
                <th scope="col">Climbed</th>
                <th scope="col" className="wk-num-col wk-hide-sm">
                  Summit
                </th>
                <th scope="col" className="wk-num-col">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                if ("month" in row) {
                  const [year, month] = row.month.split("-");
                  return (
                    <tr key={row.month} className="wk-month-row">
                      <td colSpan={5}>
                        {MONTHS[Number(month) - 1]} {year}
                      </td>
                    </tr>
                  );
                }
                const hike = row.hike;
                return (
                  <tr key={hike.slug} data-active={hike.slug === pick?.slug} onClick={() => setSelected(hike.slug)}>
                    <td>
                      <Link href={`/hikes/${hike.slug}`}>{hike.title}</Link>
                      <div className="wk-muted" style={{ fontSize: "0.82rem" }}>
                        <time dateTime={hike.date}>{formatDay(hike.date)}</time>
                      </div>
                    </td>
                    <td className="wk-hide-sm">{hike.region}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span className="wk-climb" style={{ width: `${Math.round(8 + (hike.climbedM / maxClimbed) * 72)}px` }} aria-hidden="true" />
                      {formatMeters(hike.climbedM)}
                    </td>
                    <td className="wk-num-col wk-hide-sm">{formatMeters(hike.heightM)}</td>
                    <td className="wk-num-col">{formatDuration(hike.durationMin)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
