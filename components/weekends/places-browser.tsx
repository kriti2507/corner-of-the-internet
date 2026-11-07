"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { JapanMap } from "@/components/weekends/japan-map";
import { PLACE_KINDS, placeWhere, type Place, type PlaceKind } from "@/content/places";

const KIND_COLOR: Record<PlaceKind, string> = {
  cafe: "#b07a45",
  matcha: "#7d9c4a",
  onsen: "#d0654b",
  park: "#4f8a73",
  trip: "#6a87b8",
};

const REGION_ORDER = ["Tokyo", "Hokkaido", "Tohoku", "Kyoto", "Okinawa"];

function regionRank(region: string) {
  const index = REGION_ORDER.indexOf(region);
  return index === -1 ? REGION_ORDER.length : index;
}

export function PlacesBrowser({ places }: { places: Place[] }) {
  const [kind, setKind] = useState<PlaceKind | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const regions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const place of places) counts.set(place.region, (counts.get(place.region) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => regionRank(a[0]) - regionRank(b[0]));
  }, [places]);

  const kindCounts = useMemo(
    () =>
      PLACE_KINDS.map((item) => ({
        ...item,
        count: places.filter((place) => place.kind === item.id && (!region || place.region === region)).length,
      })),
    [places, region],
  );

  const visible = places.filter((place) => (!kind || place.kind === kind) && (!region || place.region === region));
  const groups = useMemo(() => {
    const byRegion = new Map<string, Place[]>();
    for (const place of visible) byRegion.set(place.region, [...(byRegion.get(place.region) ?? []), place]);
    return [...byRegion.entries()].sort((a, b) => regionRank(a[0]) - regionRank(b[0]));
  }, [visible]);

  function select(slug: string) {
    setActive(slug);
    const card = document.getElementById(`place-${slug}`);
    if (!card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <>
      <div className="wk-filters" role="toolbar" aria-label="Kind of place">
        <button type="button" className="wk-filter" aria-pressed={kind === null} onClick={() => setKind(null)}>
          Everything <span className="wk-count">{places.filter((place) => !region || place.region === region).length}</span>
        </button>
        {kindCounts.map((item) => (
          <button
            key={item.id}
            type="button"
            className="wk-filter"
            aria-pressed={kind === item.id}
            disabled={item.count === 0}
            onClick={() => setKind(kind === item.id ? null : item.id)}
          >
            <span className="wk-filter-dot" style={{ "--dot": KIND_COLOR[item.id] } as React.CSSProperties} aria-hidden="true" />
            {item.plural} <span className="wk-count">{item.count}</span>
          </button>
        ))}
      </div>
      <div className="wk-filters" role="toolbar" aria-label="Region" style={{ marginBottom: "1.4rem" }}>
        <button type="button" className="wk-filter" aria-pressed={region === null} onClick={() => setRegion(null)}>
          All of Japan
        </button>
        {regions.map(([name, count]) => (
          <button
            key={name}
            type="button"
            className="wk-filter"
            aria-pressed={region === name}
            onClick={() => setRegion(region === name ? null : name)}
          >
            {name} <span className="wk-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="wk-places-layout">
        <JapanMap
          label="Map of the places shown"
          caption="Pins are approximate. Tap one to find the card."
          activeId={active}
          onSelect={select}
          points={visible.map((place) => ({
            id: place.slug,
            lat: place.lat,
            lng: place.lng,
            label: `${place.name}, ${placeWhere(place)}`,
            color: KIND_COLOR[place.kind],
          }))}
        />
        <div>
          {groups.length === 0 ? <p className="wk-muted">Nothing here with these filters yet.</p> : null}
          {groups.map(([name, items]) => (
            <section key={name} className="wk-region-group" aria-labelledby={`region-${name}`}>
              <h2 id={`region-${name}`}>
                {name} <small>{items.length}</small>
              </h2>
              <ul className="wk-place-grid">
                {items.map((place) => {
                  const kindCopy = PLACE_KINDS.find((item) => item.id === place.kind);
                  return (
                    <li key={place.slug}>
                      <article
                        id={`place-${place.slug}`}
                        className="wk-card wk-place"
                        data-kind={place.kind}
                        data-active={active === place.slug}
                        onMouseEnter={() => setActive(place.slug)}
                      >
                        <div className="wk-place-top wk-kind" data-kind={place.kind}>
                          <span className="wk-pill">{kindCopy?.label}</span>
                          <span className="wk-place-where">{place.area === place.region ? "" : place.area}</span>
                        </div>
                        <h3>
                          <Link href={`/places/${place.slug}`}>{place.name}</Link>
                        </h3>
                        {place.myNote ? (
                          <p className="wk-place-note wk-quote">{place.note}</p>
                        ) : (
                          <p className="wk-place-note wk-muted">{place.note}</p>
                        )}
                        <div className="wk-place-foot">
                          <Link href={`/places/${place.slug}`}>Details</Link>
                          <a href={place.mapUrl} target="_blank" rel="noopener noreferrer">
                            Google Maps ↗
                          </a>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
