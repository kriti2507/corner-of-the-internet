"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import rings from "@/data/japan-rings.json";
import type { Hike } from "@/lib/hikes";
import { formatDay, formatDuration, formatHours, formatMeters } from "@/lib/format";

const WIDTH = 440;
const HEIGHT = 560;
const JAPAN = { minLng: 128, maxLng: 146.8, minLat: 30, maxLat: 46 };

const REGION_COLOR: Record<string, string> = {
  Hokkaido: "#7eb0d6",
  Tokyo: "#e7a3a0",
  Ibaraki: "#b7c99a",
  Nagano: "#efd15f",
  Kanagawa: "#f0c9a8",
  Chiba: "#d7c4e2",
  Tochigi: "#8fb8a8",
};

type Bounds = typeof JAPAN;

function sameBounds(a: Bounds, b: Bounds) {
  return a.minLng === b.minLng && a.maxLng === b.maxLng && a.minLat === b.minLat && a.maxLat === b.maxLat;
}

function boundsFor(list: Hike[]): Bounds {
  const placed = list.filter((hike) => hike.lat != null && hike.lng != null);
  if (placed.length === 0) return JAPAN;
  const lats = placed.map((hike) => hike.lat as number);
  const lngs = placed.map((hike) => hike.lng as number);
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const midLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const latSpan = Math.max(1.35, (Math.max(...lats) - Math.min(...lats)) * 1.9);
  const lngSpan = Math.max(1.6, (Math.max(...lngs) - Math.min(...lngs)) * 1.9);
  return {
    minLat: midLat - latSpan / 2,
    maxLat: midLat + latSpan / 2,
    minLng: midLng - lngSpan / 2,
    maxLng: midLng + lngSpan / 2,
  };
}

function project(bounds: Bounds, lng: number, lat: number) {
  return {
    x: ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * WIDTH,
    y: ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * HEIGHT,
  };
}

type Pin = Hike & { x: number; y: number };

function clusterPins(pins: Pin[], threshold: number) {
  const groups: { x: number; y: number; items: Pin[] }[] = [];
  for (const pin of pins) {
    const group = groups.find((item) => Math.hypot(item.x - pin.x, item.y - pin.y) < threshold);
    if (!group) {
      groups.push({ x: pin.x, y: pin.y, items: [pin] });
      continue;
    }
    group.items.push(pin);
    group.x = group.items.reduce((sum, item) => sum + item.x, 0) / group.items.length;
    group.y = group.items.reduce((sum, item) => sum + item.y, 0) / group.items.length;
  }
  return groups;
}

export function HikesSection({
  hikes,
  kicker,
  title,
  lede,
  mapLabel,
  approxNote,
  preview = false,
  moreHref,
  moreLabel,
}: {
  hikes: Hike[];
  kicker: string;
  title: string;
  lede: string;
  mapLabel: string;
  approxNote: string;
  preview?: boolean;
  moreHref?: string;
  moreLabel?: string;
}) {
  const [selected, setSelected] = useState(hikes[hikes.length - 1]?.title ?? "");
  const panelRef = useRef<HTMLElement>(null);
  const [bounds, setBounds] = useState<Bounds>(JAPAN);
  const [region, setRegion] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);
  const zoomed = !sameBounds(bounds, JAPAN);

  const totals = useMemo(() => {
    const minutes = hikes.reduce((sum, item) => sum + (item.durationMin ?? 0), 0);
    const timed = hikes.filter((item) => item.durationMin != null).length;
    const highest = hikes.reduce((best, item) => (item.heightM > best.heightM ? item : best), hikes[0]);
    return {
      count: hikes.length,
      climbed: hikes.reduce((sum, item) => sum + item.climbedM, 0),
      minutes,
      timed,
      highest,
    };
  }, [hikes]);

  const shown = useMemo(
    () => (season ? hikes.filter((item) => item.tags.includes(season)) : hikes),
    [hikes, season],
  );
  const hike = shown.find((item) => item.title === selected) ?? shown[shown.length - 1] ?? hikes[0];
  const seasons = useMemo(() => {
    const found = new Set<string>();
    for (const item of hikes) {
      const tag = item.tags.find((entry) => entry === "winter" || entry === "spring" || entry === "summer" || entry === "autumn");
      if (tag) found.add(tag);
    }
    return ["spring", "summer", "autumn", "winter"].filter((item) => found.has(item));
  }, [hikes]);

  const regions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of hikes) counts.set(item.region, (counts.get(item.region) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [hikes]);

  const path = useMemo(() => {
    return (rings as number[][][])
      .map((ring) =>
        ring
          .map((point, index) => {
            const { x, y } = project(bounds, point[0], point[1]);
            return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join(" ") + " Z",
      )
      .join(" ");
  }, [bounds]);

  const pins = useMemo(
    () =>
      shown
        .filter((item) => item.lat != null && item.lng != null)
        .map((item) => ({ ...item, ...project(bounds, item.lng as number, item.lat as number) })),
    [shown, bounds],
  );

  const groups = zoomed ? pins.map((pin) => ({ x: pin.x, y: pin.y, items: [pin] })) : clusterPins(pins, 16);
  const maxClimbed = Math.max(1, ...shown.map((item) => item.climbedM));

  function pool() {
    return season ? hikes.filter((item) => item.tags.includes(season)) : hikes;
  }

  function showTrail(title: string, scroll: boolean) {
    setSelected(title);
    if (!scroll) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panelRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }

  function selectRegion(next: string | null) {
    setRegion(next);
    const base = pool();
    if (!next) {
      setBounds(JAPAN);
      const latest = [...base].sort((a, b) => b.date.localeCompare(a.date))[0];
      if (latest) setSelected(latest.title);
      return;
    }
    const inRegion = base.filter((item) => item.region === next);
    setBounds(boundsFor(inRegion));
    const latest = [...inRegion].sort((a, b) => b.date.localeCompare(a.date))[0];
    if (latest) setSelected(latest.title);
  }

  function selectSeason(next: string | null) {
    setSeason(next);
    const base = next ? hikes.filter((item) => item.tags.includes(next)) : hikes;
    const inView = region ? base.filter((item) => item.region === region) : base;
    if (region) setBounds(inView.length ? boundsFor(inView) : JAPAN);
    const latest = [...inView].sort((a, b) => b.date.localeCompare(a.date))[0];
    if (latest) setSelected(latest.title);
  }

  return (
    <section className={preview ? "band band-tight" : "band band-tight hikes-compact"} id="hikes" aria-labelledby="hikes-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        {preview ? <h2 id="hikes-heading">{title}</h2> : <h1 id="hikes-heading">{title}</h1>}
        <p className="lede">{lede}</p>
        <dl className={preview ? "totals totals-pair" : "totals"}>
          <div>
            <dt>Hikes</dt>
            <dd>{totals.count}</dd>
          </div>
          <div>
            <dt>Metres climbed</dt>
            <dd>{formatMeters(totals.climbed)}</dd>
          </div>
          {preview ? null : (
            <div>
              <dt>On the trail</dt>
              <dd>
                {formatHours(totals.minutes)}
                <span> {totals.timed} of {totals.count} timed</span>
              </dd>
            </div>
          )}
          {preview ? null : (
            <div>
              <dt>Highest summit</dt>
              <dd>
                {totals.highest.title}
                <span> {formatMeters(totals.highest.heightM)}</span>
              </dd>
            </div>
          )}
        </dl>

        {preview ? null : (
        <div className="chips" role="toolbar" aria-label="Regions">
          <button type="button" className="chip" aria-pressed={region === null && !zoomed} onClick={() => selectRegion(null)}>
            All Japan
          </button>
          {regions.map(([name, count]) => (
            <button
              key={name}
              type="button"
              className="chip"
              aria-pressed={region === name}
              onClick={() => selectRegion(name)}
            >
              {name}
              <span className="chip-count"> {count}</span>
            </button>
          ))}
        </div>
        )}

        {preview || seasons.length === 0 ? null : (
          <div className="chips" role="toolbar" aria-label="Season">
            <button type="button" className="chip" aria-pressed={season === null} onClick={() => selectSeason(null)}>
              All seasons
            </button>
            {seasons.map((name) => (
              <button key={name} type="button" className="chip" aria-pressed={season === name} onClick={() => selectSeason(name)}>
                {name}
              </button>
            ))}
          </div>
        )}

        <div className={preview ? "hike-preview" : "hike-map"}>
          {preview ? (
            <div className="preview-copy">
              {hike ? (
                <p className="preview-peak">
                  <span className="card-kicker">{hike.region}</span>
                  {hike.title}
                </p>
              ) : null}
              {moreHref && moreLabel ? (
                <Link className="btn btn-ink" href={moreHref}>
                  {moreLabel}
                </Link>
              ) : null}
            </div>
          ) : null}
          <figure className={preview ? "map-frame map-preview" : "map-frame"}>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={mapLabel}>
              <rect width={WIDTH} height={HEIGHT} fill="#d5e3f0" />
              <path d={path} fill="#f6f1e6" stroke="#1c2744" strokeWidth="1.4" strokeLinejoin="round" />
              {groups.map((group) => {
                const active = group.items.some((item) => item.title === selected);
                const color = REGION_COLOR[group.items[0].region] ?? "#efd15f";
                const label =
                  group.items.length === 1
                    ? `${group.items[0].title}, ${group.items[0].region}`
                    : `${group.items.length} hikes: ${group.items.map((item) => item.title).join(", ")}`;
                return (
                  <g
                    key={group.items.map((item) => item.title).join("-")}
                    transform={`translate(${group.x.toFixed(1)} ${group.y.toFixed(1)})`}
                  >
                    <circle
                      r={group.items.length > 1 ? 13 : 11}
                      fill="transparent"
                      className="pin-hit"
                      tabIndex={0}
                      role="button"
                      aria-label={label}
                      aria-pressed={active}
                      onClick={() => {
                        if (group.items.length === 1) showTrail(group.items[0].title, true);
                        else setBounds(boundsFor(group.items));
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        if (group.items.length === 1) showTrail(group.items[0].title, true);
                        else setBounds(boundsFor(group.items));
                      }}
                    />
                    <circle
                      r={group.items.length > 1 ? 8 : active ? 7 : 5.5}
                      fill={color}
                      stroke="#1c2744"
                      strokeWidth={active ? 2.5 : 1.6}
                      pointerEvents="none"
                    />
                    {group.items.length > 1 ? (
                      <text
                        textAnchor="middle"
                        y="3.5"
                        fontSize="9"
                        fontWeight="700"
                        fill="#1c2744"
                        pointerEvents="none"
                      >
                        {group.items.length}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
            <figcaption>{mapLabel}</figcaption>
          </figure>

        </div>

        {preview ? null : (
        <div className="elev-block">
          <div className="elev" role="list" aria-label="Metres climbed, earliest to latest">
            {shown.map((item) => (
              <button
                key={item.title}
                type="button"
                className="elev-item"
                aria-pressed={item.title === selected}
                aria-controls="hike-detail"
                aria-label={`${item.title}, ${formatDay(item.date)}. Summit ${formatMeters(item.heightM)}, climbed ${formatMeters(item.climbedM)}, ${formatDuration(item.durationMin)}.`}
                onMouseEnter={() => setSelected(item.title)}
                onFocus={() => setSelected(item.title)}
                onClick={() => showTrail(item.title, true)}
              >
                <span
                  className="elev-bar"
                  style={{
                    height: `${16 + (item.climbedM / maxClimbed) * 84}px`,
                    background: REGION_COLOR[item.region] ?? "#efd15f",
                  }}
                />
                <span className="elev-name">{item.title}</span>
              </button>
            ))}
          </div>
          {hike ? (
            <article className="hike-panel" id="hike-detail" ref={panelRef}>
              <p className="card-kicker">{hike.region}</p>
              <h2 className="hike-panel-title">{hike.title}</h2>
              <p>
                <time dateTime={hike.date}>{formatDay(hike.date)}</time>
              </p>
              <p className="hike-blurb">
                Summit {formatMeters(hike.heightM)}, climbed {formatMeters(hike.climbedM)}, {formatDuration(hike.durationMin)} on the trail.
              </p>
              <dl className="detail-stats">
                <div>
                  <dt>Mountain height</dt>
                  <dd>{formatMeters(hike.heightM)}</dd>
                </div>
                <div>
                  <dt>Metres climbed</dt>
                  <dd>{formatMeters(hike.climbedM)}</dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>{formatDuration(hike.durationMin)}</dd>
                </div>
              </dl>
              {hike.pinApproximate ? <p className="quiet-note">{approxNote}</p> : null}
              {hike.lat == null ? <p className="quiet-note">This one is not on the map yet.</p> : null}
              <p>
                <Link className="card-link" href={`/hikes/${hike.slug}`}>
                  This trail →
                </Link>
              </p>
            </article>
          ) : null}
        </div>
        )}

        {preview ? null : (
          <ul className="hike-grid">
            {shown.map((item) => (
              <li key={item.slug}>
                <Link className="hike-chip" href={`/hikes/${item.slug}`}>
                  <span className="hike-chip-name">{item.title}</span>
                  <span className="hike-chip-meta">
                    {item.region} · {formatDay(item.date)} · {formatMeters(item.climbedM)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
