"use client";

import { useEffect, useState } from "react";

const RANGES = [
  { id: "30d", count: 35, columns: 7 },
  { id: "90d", count: 91, columns: 13 },
  { id: "1y", count: 182, columns: 26 },
  { id: "All", count: 286, columns: 26 },
] as const;

type RangeId = (typeof RANGES)[number]["id"];

type Cell = { tone: "green" | "purple" | "clay"; level: 1 | 2 | 3 | 4 } | null;

function sample(seed: number, count: number): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < count; i++) {
    const n = (i * 17 + seed * 29) % 13;
    if (n > 8) {
      cells.push(null);
      continue;
    }
    const tone = n % 5 === 0 ? "clay" : n % 2 === 0 ? "green" : "purple";
    const level = ((n % 4) + 1) as 1 | 2 | 3 | 4;
    cells.push({ tone, level });
  }
  return cells;
}

export function TimeCapsule({
  ranges,
  note,
}: {
  ranges: readonly string[];
  note: string;
}) {
  const [range, setRange] = useState<RangeId>("30d");
  const [month, setMonth] = useState(0);
  const [on, setOn] = useState(false);
  const spec = RANGES.find((item) => item.id === range) ?? RANGES[0];
  const cells = sample(month + spec.count, spec.count);

  useEffect(() => {
    const node = document.getElementById("sw-capsule");
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setOn(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function pick(next: RangeId) {
    setOn(false);
    setRange(next);
    requestAnimationFrame(() => setOn(true));
  }

  return (
    <div className="sw-capsule" id="sw-capsule">
      <div className="sw-capsule-bar">
        <button
          type="button"
          className="sw-arrow"
          aria-label="Previous sample"
          onClick={() => setMonth((value) => (value + 2) % 3)}
        >
          ‹
        </button>
        <p className="sw-sample">Sample {month + 1}</p>
        <button
          type="button"
          className="sw-arrow"
          aria-label="Next sample"
          onClick={() => setMonth((value) => (value + 1) % 3)}
        >
          ›
        </button>
      </div>
      <div className="sw-ranges" role="toolbar" aria-label="Zoom">
        {ranges.map((label) => (
          <button
            key={label}
            type="button"
            className="chip"
            aria-pressed={range === label}
            onClick={() => pick(label as RangeId)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        key={`${range}-${month}`}
        className={on ? "sw-grid is-on" : "sw-grid"}
        style={{ gridTemplateColumns: `repeat(${spec.columns}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {cells.map((cell, index) => (
          <span
            key={`${range}-${month}-${index}`}
            className={cell ? `sw-cell tone-${cell.tone} lv-${cell.level}` : "sw-cell"}
            style={{ ["--i" as string]: String(Math.min(index, 40)) }}
          />
        ))}
      </div>
      <p className="sw-note">{note}</p>
    </div>
  );
}
