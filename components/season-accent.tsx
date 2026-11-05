"use client";

import { useEffect, useState } from "react";
import { tokyoSeason, type TokyoSeason } from "@/lib/tokyo";

function Petal({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="5" ry="8" fill="#f4c9c4" stroke="#1c2744" strokeWidth="1" />
    </svg>
  );
}

function Leaf({ className, fill }: { className: string; fill: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 C18 8 20 14 12 22 C4 14 6 8 12 2 Z" fill={fill} stroke="#1c2744" strokeWidth="1" />
      <path d="M12 6 V18" fill="none" stroke="#1c2744" strokeWidth="1" />
    </svg>
  );
}

function Flake({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1 V15 M1 8 H15 M3 3 L13 13 M13 3 L3 13" fill="none" stroke="#1c2744" strokeWidth="1.2" />
    </svg>
  );
}

const spots = ["s1", "s2", "s3", "s4", "s5", "s6"];

export function MatchaLeaf() {
  const [season, setSeason] = useState<TokyoSeason | null>(null);
  useEffect(() => setSeason(tokyoSeason()), []);
  const fill = season === "autumn" ? "#c46a62" : season === "spring" ? "#f4c9c4" : season === "winter" ? "#d5e3f0" : "#c9d5b0";
  return (
    <svg className="matcha-leaf" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 C18 8 19 14 12 21 C5 14 6 8 12 3 Z" fill={fill} stroke="#1c2744" strokeWidth="1.2" />
    </svg>
  );
}

export function SeasonAccent() {
  const [season, setSeason] = useState<TokyoSeason | null>(null);
  useEffect(() => setSeason(tokyoSeason()), []);
  if (!season) return null;
  return (
    <div className={`season-accent season-${season}`} aria-hidden="true">
      {spots.map((spot) =>
        season === "spring" ? (
          <Petal key={spot} className={spot} />
        ) : season === "winter" ? (
          <Flake key={spot} className={spot} />
        ) : (
          <Leaf key={spot} className={spot} fill={season === "summer" ? "#c9d5b0" : "#c46a62"} />
        ),
      )}
    </div>
  );
}
