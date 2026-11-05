"use client";

import { useEffect, useState } from "react";
import { skyPhase, type SkyPhase } from "@/lib/tokyo";

export function TokyoSkyline() {
  const [phase, setPhase] = useState<SkyPhase>("day");

  useEffect(() => {
    const update = () => setPhase(skyPhase());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`tokyo-skyline is-${phase}`} aria-hidden="true">
      <svg viewBox="0 0 1200 96" preserveAspectRatio="xMidYMax meet">
        <g className="sky-lines" fill="none" stroke="#1c2744" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M0 28 C 80 18, 140 34, 220 26 S 360 14, 460 24 S 620 12, 760 22 S 980 16, 1200 26" />
          <path d="M40 78 V50 M28 56 H52" />
          <path d="M180 78 V44 M166 52 H194" />
          <path d="M1040 78 V46 M1026 54 H1054" />
          <path d="M70 78 V58 H118 V48 H150 V66 H188 V78" />
          <path d="M94 58 V46 H126 V58" />
          <path d="M210 78 V62 H248 L268 46 L288 62 H330 V78" />
          <path d="M248 62 V52 H288 V62" />
          <path d="M360 78 V54 H390 V44 H430 V60 H470 V78" />
          <path d="M500 78 V50 H560 V78" />
          <path d="M520 50 V36 H542 V50" />
          <path d="M530 78 L548 18 L566 78" />
          <path d="M538 48 H558 M542 36 H554 M545 26 H551" />
          <path d="M548 18 V8" />
          <path d="M620 78 V56 H700 L724 40 L748 56 H820 V78" />
          <path d="M660 56 V46 H710 V56" />
          <path d="M860 78 V60 H900 V50 H940 V64 H990 V78" />
          <path d="M1080 78 V52 H1130 V40 H1170 V64 H1200" />
        </g>
        <g className="sky-lights">
          <circle cx="100" cy="66" r="2" />
          <circle cx="230" cy="70" r="2" />
          <circle cx="400" cy="64" r="2" />
          <circle cx="548" cy="40" r="2.2" />
          <circle cx="670" cy="66" r="2" />
          <circle cx="900" cy="70" r="2" />
          <circle cx="1100" cy="60" r="2" />
        </g>
      </svg>
    </div>
  );
}
