"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import "@/app/season-fall.css";

/**
 * A one-time shower of whatever Tokyo's season is dropping right now:
 * sakura in spring, green leaves in summer, momiji in autumn, snow in winter.
 * It plays once per visit (per browser session) and the little button in the
 * corner lets the visitor ask for it again. Add `?season=winter` (or spring,
 * summer, autumn) to any URL to preview a different season.
 */

type Season = "spring" | "summer" | "autumn" | "winter";

type Piece = {
  id: number;
  shape: "maple" | "petal" | "leaf" | "flake" | "dot";
  color: string;
  x: number; // vw
  size: number; // px
  drift: number; // px of sideways travel over the whole fall
  sway: number; // px of side-to-side swing
  dur: number; // s
  delay: number; // s
  swayDur: number; // s
  spinDur: number; // s
  tilt: number; // deg, starting rotation
  spinDir: 1 | -1;
  opacity: number;
};

const SEEN_KEY = "season-fall:seen";
const SEASONS: readonly Season[] = ["spring", "summer", "autumn", "winter"];

const CONFIG: Record<
  Season,
  {
    label: string;
    count: number;
    size: [number, number];
    dur: [number, number];
    colors: readonly string[];
    shapes: readonly Piece["shape"][];
  }
> = {
  spring: {
    label: "sakura",
    count: 42,
    size: [12, 20],
    dur: [7, 11],
    colors: ["#f9c9d5", "#f4b3c4", "#fbdce4", "#f6bfcc", "#efa9bb"],
    shapes: ["petal"],
  },
  summer: {
    label: "green leaves",
    count: 24,
    size: [18, 30],
    dur: [6, 9.5],
    colors: ["#6f9a4a", "#8db363", "#557f3b", "#a3c27a", "#7aa356"],
    shapes: ["leaf"],
  },
  autumn: {
    label: "momiji",
    count: 30,
    size: [22, 36],
    dur: [6.5, 10.5],
    colors: ["#c8331f", "#d9461f", "#e8702a", "#b3261e", "#e39a2b", "#a8321c"],
    shapes: ["maple"],
  },
  winter: {
    label: "snow",
    count: 70,
    size: [5, 12],
    dur: [8, 13],
    colors: ["#ffffff"],
    shapes: ["dot", "dot", "dot", "flake"],
  },
};

const ICON_COLOR: Record<Season, string> = {
  spring: "#f4b3c4",
  summer: "#7aa356",
  autumn: "#d9461f",
  winter: "#c5d7ea",
};

function tokyoSeason(date = new Date()): Season {
  const month = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tokyo", month: "numeric" }).format(date),
  );
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function pickSeason(): Season {
  try {
    const forced = new URLSearchParams(window.location.search).get("season");
    if (forced && (SEASONS as readonly string[]).includes(forced)) return forced as Season;
  } catch {
    /* fall through to the real season */
  }
  return tokyoSeason();
}

const noopSubscribe = () => () => {};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

function makePieces(season: Season, startId: number): Piece[] {
  const cfg = CONFIG[season];
  // Fewer pieces on small screens so the page doesn't get buried.
  const scale = window.innerWidth < 640 ? 0.55 : window.innerWidth < 1024 ? 0.8 : 1;
  const count = Math.round(cfg.count * scale);
  return Array.from({ length: count }, (_, i) => {
    const shape = pick(cfg.shapes);
    const size = shape === "flake" ? rand(10, 16) : rand(cfg.size[0], cfg.size[1]);
    return {
      id: startId + i,
      shape,
      color: pick(cfg.colors),
      x: rand(-5, 100),
      size,
      drift: rand(-60, 140),
      sway: season === "winter" ? rand(8, 22) : rand(18, 50),
      dur: rand(cfg.dur[0], cfg.dur[1]),
      delay: rand(0, 3.5),
      swayDur: rand(1.6, 3.2),
      spinDur: rand(2.2, 5),
      tilt: rand(0, 360),
      spinDir: Math.random() < 0.5 ? 1 : -1,
      opacity: season === "winter" ? rand(0.7, 1) : rand(0.82, 1),
    };
  });
}

const MAPLE =
  "M48.2 64.8L45.4 66.5L43.1 66.9L42.1 69.2L39.8 69.5L38.8 70.7L36.4 71.1L35.3 71.5L33.1 72.1L31.7 72.1L29.6 72.9L28.7 72.5L26.7 73.5L26.3 72.8L25.9 72.2L27.6 70.8L27.7 69.8L29.3 68.3L29.9 67L31.5 65.3L32.3 64.4L33.7 62.5L35.1 62.1L36.5 60.2L38.9 60.3L40.3 58.4L40.2 59.9L37.6 62.4L35.7 60.9L31.9 62.1L30 60.5L27.2 60.6L25.2 59L23 58.2L20.9 57L18.8 55.6L16.7 54.7L15.3 53.2L13.2 52.6L12.6 51.4L13.6 50.5L15.8 50.6L17.6 49.8L19.8 49.6L22.3 49L24.7 48.5L27.1 48.5L29.4 47.8L32 48.8L34.4 47.9L37.5 50.4L39.9 49.6L41.3 53L35.8 52.7L35.4 50.2L30.9 48.2L30.6 45.6L27.8 43.3L27.5 40.7L25.8 38.1L25.2 35.7L24.1 32.6L23.2 30.5L22.8 28L21.6 26.1L21.7 24.3L23.5 24.5L25.1 26L27.6 26.8L29.5 28.1L32.4 29.7L34.6 30.8L36.9 32.8L39.4 33.6L41.1 36.7L43.7 37.5L44.8 42.2L47.3 43.1L46.6 48.6L42 43.9L43.4 41.7L41.1 36.8L42.7 34.6L42 30.7L43.4 28.5L43.9 25.1L45 22.9L46.2 19.5L46.9 17.3L48.4 14.8L48.7 12.6L50 11L51.3 12.6L51.6 14.8L53.1 17.3L53.8 19.5L55 22.9L56.1 25.1L56.6 28.5L58 30.7L57.3 34.6L58.9 36.8L56.6 41.7L58 43.9L53.4 48.6L52.7 43.1L55.2 42.2L56.3 37.5L58.9 36.7L60.6 33.6L63.1 32.8L65.4 30.8L67.6 29.7L70.5 28.1L72.4 26.8L74.9 26L76.5 24.5L78.3 24.3L78.4 26.1L77.2 28L76.8 30.5L75.9 32.6L74.8 35.7L74.2 38.1L72.5 40.7L72.2 43.3L69.4 45.6L69.1 48.2L64.6 50.2L64.2 52.7L58.7 53L60.1 49.6L62.5 50.4L65.6 47.9L68 48.8L70.6 47.8L72.9 48.5L75.3 48.5L77.7 49L80.2 49.6L82.4 49.8L84.2 50.6L86.4 50.5L87.4 51.4L86.8 52.6L84.7 53.2L83.3 54.7L81.2 55.6L79.1 57L77 58.2L74.8 59L72.8 60.6L70 60.5L68.1 62.1L64.3 60.9L62.4 62.4L59.8 59.9L59.7 58.4L61.1 60.3L63.5 60.2L64.9 62.1L66.3 62.5L67.7 64.4L68.5 65.3L70.1 67L70.7 68.3L72.3 69.8L72.4 70.8L74.1 72.2L73.7 72.8L73.3 73.5L71.3 72.5L70.4 72.9L68.3 72.1L66.9 72.1L64.7 71.5L63.6 71.1L61.2 70.7L60.2 69.5L57.9 69.2L56.9 66.9L54.6 66.5L51.8 64.8Z";
const PETAL = "M50 96C24 80 10 52 22 26C28 14 40 10 45 18L50 28L55 18C60 10 72 14 78 26C90 52 76 80 50 96Z";
const LEAF = "M50 4C76 20 86 52 72 76C66 86 58 92 50 96C42 92 34 86 28 76C14 52 24 20 50 4Z";

function Shape({ shape, color }: { shape: Piece["shape"]; color: string }) {
  switch (shape) {
    case "maple":
      return (
        <svg viewBox="0 0 100 100">
          <path d="M50 58L50 90" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <path d={MAPLE} fill={color} />
        </svg>
      );
    case "petal":
      return (
        <svg viewBox="0 0 100 100">
          <path d={PETAL} fill={color} />
          <path d="M50 88C46 66 47 48 50 36" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 100 100">
          <path d={LEAF} fill={color} />
          <path d="M50 14L50 99" stroke="#2f4a22" strokeOpacity="0.35" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case "flake":
      return (
        <svg viewBox="0 0 100 100">
          <g stroke={color} strokeWidth="7" strokeLinecap="round" fill="none">
            {[0, 60, 120].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 50 50)`}>
                <path d="M50 8L50 92" />
                <path d="M38 20L50 30L62 20M38 80L50 70L62 80" />
              </g>
            ))}
          </g>
        </svg>
      );
    case "dot":
      return (
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill={color} />
        </svg>
      );
  }
}

function SeasonIcon({ season }: { season: Season }) {
  const color = ICON_COLOR[season];
  switch (season) {
    case "spring":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((deg) => (
            <path key={deg} d="M50 50C38 40 36 20 46 12L50 18L54 12C64 20 62 40 50 50Z" fill={color} stroke="var(--ink)" strokeWidth="3" transform={`rotate(${deg} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="6" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="3" />
        </svg>
      );
    case "summer":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d={LEAF} fill={color} stroke="var(--ink)" strokeWidth="4" transform="rotate(35 50 50) scale(0.9) translate(5 5)" />
          <path d="M50 18L50 92" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" transform="rotate(35 50 50) scale(0.9) translate(5 5)" />
        </svg>
      );
    case "autumn":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 58L50 92" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
          <path d={MAPLE} fill={color} stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case "winter":
      return (
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <g stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" fill="none">
            {[0, 60, 120].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 50 50)`}>
                <path d="M50 10L50 90" />
                <path d="M38 22L50 32L62 22M38 78L50 68L62 78" />
              </g>
            ))}
          </g>
          <circle cx="50" cy="50" r="9" fill={color} stroke="var(--ink)" strokeWidth="4" />
        </svg>
      );
  }
}

export function SeasonFall() {
  // Client-only value: null while server rendering / hydrating, then the season.
  const season = useSyncExternalStore(noopSubscribe, pickSeason, () => null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const nextId = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  const drop = useCallback((which: Season) => {
    const batch = makePieces(which, nextId.current);
    nextId.current += batch.length;
    const longest = Math.max(...batch.map((p) => p.delay + p.dur));
    setPieces(batch);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPieces([]), (longest + 0.5) * 1000);
  }, []);

  useEffect(() => {
    if (!season) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked: just play it */
    }
    const forced = new URLSearchParams(window.location.search).has("season");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Wait a beat after the first paint so the page is there to fall onto.
    const start = (!seen || forced) && !calm ? window.setTimeout(() => drop(season), 350) : undefined;

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(timer.current);
    };
  }, [season, drop]);

  if (!season) return null;
  const label = CONFIG[season].label;

  return (
    <>
      {pieces.length > 0 ? (
        <div className="sf-layer" aria-hidden="true">
          {pieces.map((p) => (
            <span
              key={p.id}
              className={`sf-piece sf-${p.shape}`}
              style={
                {
                  "--x": `${p.x}vw`,
                  "--size": `${p.size}px`,
                  "--drift": `${p.drift}px`,
                  "--sway": `${p.sway}px`,
                  "--dur": `${p.dur}s`,
                  "--delay": `${p.delay}s`,
                  "--sway-dur": `${p.swayDur}s`,
                  "--spin-dur": `${p.spinDur}s`,
                  "--tilt": `${p.tilt}deg`,
                  "--spin-dir": p.spinDir,
                  "--opacity": p.opacity,
                } as CSSProperties
              }
            >
              <span className="sf-sway">
                <span className="sf-spin">
                  <Shape shape={p.shape} color={p.color} />
                </span>
              </span>
            </span>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        className="sf-again"
        onClick={() => drop(season)}
        aria-label={`Let the ${label} fall again`}
        title={`Let the ${label} fall again`}
      >
        <SeasonIcon season={season} />
        <span className="sf-again-tip script" aria-hidden="true">
          more {label}?
        </span>
      </button>
    </>
  );
}
