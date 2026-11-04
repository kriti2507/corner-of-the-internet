"use client";

import { useMemo, useState } from "react";
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
}: {
  hikes: Hike[];
  kicker: string;
  title: string;
  lede: string;
  mapLabel: string;
  approxNote: string;
}) {
  const [selected, setSelected] = useState(hikes[hikes.length - 1]?.title ?? "");
  const [bounds, setBounds] = useState<Bounds>(JAPAN);
  const [region, setRegion] = useState<string | null>(null);
  const zoomed = !sameBounds(bounds, JAPAN);
  const hike = hikes.find((item) => item.title === selected) ?? hikes[0];

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
      hikes
        .filter((item) => item.lat != null && item.lng != null)
        .map((item) => ({ ...item, ...project(bounds, item.lng as number, item.lat as number) })),
    [hikes, bounds],
  );

  const groups = zoomed ? pins.map((pin) => ({ x: pin.x, y: pin.y, items: [pin] })) : clusterPins(pins, 16);
  const maxClimbed = Math.max(...hikes.map((item) => item.climbedM));

  function selectRegion(next: string | null) {
    setRegion(next);
    if (!next) {
      setBounds(JAPAN);
      return;
    }
    const inRegion = hikes.filter((item) => item.region === next);
    setBounds(boundsFor(inRegion));
    const latest = [...inRegion].sort((a, b) => b.date.localeCompare(a.date))[0];
    if (latest) setSelected(latest.title);
  }

  return (
    <section className="band band-tight" id="hikes" aria-labelledby="hikes-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <h1 id="hikes-heading">{title}</h1>
        <p className="lede">{lede}</p>
        <dl className="totals">
          <div>
            <dt>Hikes</dt>
            <dd>{totals.count}</dd>
          </div>
          <div>
            <dt>Metres climbed</dt>
            <dd>{formatMeters(totals.climbed)}</dd>
          </div>
          <div>
            <dt>On the trail</dt>
            <dd>
              {formatHours(totals.minutes)}
              <span> {totals.timed} of {totals.count} timed</span>
            </dd>
          </div>
          <div>
            <dt>Highest summit</dt>
            <dd>
              {totals.highest.title}
              <span> {formatMeters(totals.highest.heightM)}</span>
            </dd>
          </div>
        </dl>

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

        <div className="hike-layout">
          <figure className="map-frame">
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
                        if (group.items.length === 1) setSelected(group.items[0].title);
                        else setBounds(boundsFor(group.items));
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        if (group.items.length === 1) setSelected(group.items[0].title);
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

          {hike ? (
            <article className="detail-card" aria-live="polite">
              <p className="card-kicker">{hike.region}</p>
              <h3>{hike.title}</h3>
              <p>
                <time dateTime={hike.date}>{formatDay(hike.date)}</time>
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
              <div
                className="compare"
                aria-hidden="true"
                title={`${hike.climbedM} metres climbed, summit ${hike.heightM}`}
              >
                <span style={{ width: `${Math.min(100, (hike.climbedM / hike.heightM) * 100)}%` }} />
              </div>
              {hike.pinApproximate ? <p className="quiet-note">{approxNote}</p> : null}
              {hike.lat == null ? <p className="quiet-note">This one is not on the map yet.</p> : null}
            </article>
          ) : null}
        </div>

        <div className="elev" role="list" aria-label="Metres climbed, earliest to latest">
          {hikes.map((item) => (
            <button
              key={item.title}
              type="button"
              className="elev-item"
              aria-pressed={item.title === selected}
              onClick={() => setSelected(item.title)}
            >
              <span
                className="elev-bar"
                style={{
                  height: `${18 + (item.climbedM / maxClimbed) * 120}px`,
                  background: REGION_COLOR[item.region] ?? "#efd15f",
                }}
              />
              <span className="elev-name">{item.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
