import type { Coffee, Place, Guide } from "@/lib/content";
import { COFFEE_KINDS, PLACE_KINDS } from "@/lib/content";
import { hash } from "@/lib/format";

/**
 * Drawn stand-ins for photos. Every coffee gets its own packet, every place its
 * own hanko stamp, every guide a felt letter-board. Colours come from the slug,
 * so they stay the same between builds. A real photo replaces the art whenever
 * the entry has one.
 */

const PACKET_COLOURS = [
  { body: "#c9b28a", band: "#2f5d4e", ink: "#2a1a12" }, // kraft and kissaten green
  { body: "#e9dfc9", band: "#b8322a", ink: "#2a1a12" }, // paper and hanko red
  { body: "#2f5d4e", band: "#e9b44c", ink: "#fbf6ea" }, // green and amber
  { body: "#3b2a4a", band: "#e6a5a0", ink: "#fbf6ea" }, // plum and sakura
  { body: "#1c2744", band: "#d9c3a0", ink: "#fbf6ea" }, // ink and kraft
  { body: "#e9b44c", band: "#2a1a12", ink: "#2a1a12" }, // amber and espresso
  { body: "#a9c2d6", band: "#1c2744", ink: "#1c2744" }, // sky and ink
  { body: "#b8322a", band: "#fbf6ea", ink: "#fbf6ea" }, // red and paper
];

const ROAST_SHADE: Record<string, string> = {
  light: "#c69660",
  "medium-light": "#a46c3c",
  medium: "#7d4a26",
  "medium-dark": "#5a3219",
  dark: "#33190d",
};

/** Dark or light text, whichever reads better on a fill. */
function on(fill: string) {
  const n = parseInt(fill.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#2a1a12" : "#fbf6ea";
}

export function packetColours(slug: string) {
  return PACKET_COLOURS[hash(slug) % PACKET_COLOURS.length];
}

function crimp(x: number, y: number, width: number, teeth: number) {
  const step = width / teeth;
  let d = `M${x} ${y + 6}`;
  for (let i = 0; i < teeth; i++) d += ` l${step / 2} -6 l${step / 2} 6`;
  return d;
}

/** Splits a name over up to three lines that fit the packet. */
function lines(text: string, max = 11) {
  const words = text.split(/\s+/);
  const out: string[] = [];
  for (const word of words) {
    const last = out[out.length - 1];
    if (last && (last + " " + word).length <= max) out[out.length - 1] = `${last} ${word}`;
    else out.push(word);
  }
  return out.slice(0, 3);
}

export function Packet({ coffee, className }: { coffee: Coffee; className?: string }) {
  const c = packetColours(coffee.slug);
  const seed = hash(coffee.slug);
  const roast = ROAST_SHADE[coffee.roast ?? "medium"] ?? ROAST_SHADE.medium;
  const name = lines(coffee.name);
  const id = `p-${coffee.slug}`;
  const label = `Drawing of ${coffee.name}${coffee.brand ? ` by ${coffee.brand}` : ""}`;

  if (coffee.kind === "cafe-drink" || coffee.kind === "konbini") {
    return (
      <svg viewBox="0 0 160 220" className={className} role="img" aria-label={label}>
        <defs>
          <clipPath id={`${id}-cup`}>
            <path d="M30 52 L130 52 L118 206 Q117 214 108 214 L52 214 Q43 214 42 206 Z" />
          </clipPath>
        </defs>
        <path d="M24 40 h112 v14 h-112 z" fill={c.band} />
        <path d="M34 30 h92 q8 0 8 10 h-108 q0 -10 8 -10z" fill={c.ink} opacity="0.85" />
        <g clipPath={`url(#${id}-cup)`}>
          <rect x="20" y="50" width="120" height="170" fill={c.body} />
          <rect x="20" y="104" width="120" height="58" fill={c.band} />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={20 + i * 16} y1="104" x2={36 + i * 16} y2="162" stroke={c.body} strokeWidth="1.2" opacity="0.35" />
          ))}
        </g>
        <text x="80" y="130" textAnchor="middle" className="art-name" fill={on(c.band)} fontSize="13">
          {name[0]}
        </text>
        {name[1] && (
          <text x="80" y="148" textAnchor="middle" className="art-name" fill={on(c.band)} fontSize="13">
            {name[1]}
          </text>
        )}
        <text x="80" y="192" textAnchor="middle" className="art-small" fill={on(c.body)}>
          {coffee.brand ?? COFFEE_KINDS[coffee.kind].label}
        </text>
        <path d="M66 20 q6 -8 0 -16 M80 22 q6 -9 0 -18 M94 20 q6 -8 0 -16" stroke={c.ink} strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
      </svg>
    );
  }

  if (coffee.kind === "canned") {
    return (
      <svg viewBox="0 0 160 220" className={className} role="img" aria-label={label}>
        <rect x="38" y="24" width="84" height="186" rx="12" fill={c.body} />
        <rect x="38" y="24" width="84" height="16" rx="8" fill="#b9b2a6" />
        <rect x="38" y="194" width="84" height="16" rx="8" fill="#b9b2a6" />
        <rect x="38" y="70" width="84" height="64" fill={c.band} />
        {name.map((line, i) => (
          <text key={i} x="80" y={96 + i * 16} textAnchor="middle" className="art-name" fill={on(c.band)} fontSize="13">
            {line}
          </text>
        ))}
        <text x="80" y="170" textAnchor="middle" className="art-small" fill={on(c.body)}>
          {coffee.brand ?? "Coffee"}
        </text>
        <rect x="48" y="40" width="8" height="150" fill="#fff" opacity="0.18" />
      </svg>
    );
  }

  // Drip bags, beans and ground coffee: a gusseted packet with a crimped top.
  const isBag = coffee.kind === "beans" || coffee.kind === "ground";
  const pattern = seed % 3;
  return (
    <svg viewBox="0 0 160 220" className={className} role="img" aria-label={label}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={`${crimp(16, 14, 128, 16)} L144 206 Q144 212 138 212 L22 212 Q16 212 16 206 Z`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="0" width="160" height="220" fill={c.body} />
        {/* Paper grain */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1="0" y1={20 + i * 14 + (seed % 7)} x2="160" y2={22 + i * 14} stroke={c.ink} strokeWidth="0.4" opacity="0.08" />
        ))}
        <rect x="0" y="30" width="160" height="6" fill={c.band} opacity="0.9" />
        {isBag && <circle cx="128" cy="56" r="7" fill="none" stroke={c.ink} strokeWidth="1.4" opacity="0.5" />}
        {/* The emblem: rings, stripes or a bean, picked by the slug */}
        <g transform="translate(80 92)">
          {pattern === 0 &&
            [30, 22, 14].map((r, i) => <circle key={r} r={r} fill="none" stroke={i === 1 ? roast : c.band} strokeWidth={i === 1 ? 6 : 2} />)}
          {pattern === 1 && (
            <>
              <circle r="30" fill={c.band} />
              {[-16, -8, 0, 8, 16].map((y) => (
                <rect key={y} x="-30" y={y - 2} width="60" height="3" fill={c.body} opacity="0.55" />
              ))}
            </>
          )}
          {pattern === 2 && (
            <>
              <ellipse rx="18" ry="27" fill={roast} transform="rotate(-24)" />
              <path d="M-4 -24 Q8 0 -4 24" stroke={c.body} strokeWidth="3" fill="none" transform="rotate(-24)" />
            </>
          )}
        </g>
        <rect x="16" y="140" width="128" height={20 + name.length * 15} fill={c.band} />
        {name.map((line, i) => (
          <text key={i} x="80" y={160 + i * 15} textAnchor="middle" className="art-name" fill={on(c.band)} fontSize="13">
            {line}
          </text>
        ))}
        <text
          x="80"
          y="206"
          textAnchor="middle"
          className="art-small"
          fill={on(c.body)}
          opacity="0.85"
          {...((coffee.nameJa ?? coffee.brand ?? "").length > 10 ? { textLength: 116, lengthAdjust: "spacingAndGlyphs" } : {})}
        >
          {coffee.nameJa ?? coffee.brand ?? ""}
        </text>
        {/* Roast dots */}
        <g transform="translate(58 128)">
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={i * 11} cy="0" r="3.2" fill={i <= roastIndex(coffee.roast) ? c.ink : "none"} stroke={c.ink} strokeWidth="1" opacity="0.75" />
          ))}
        </g>
        {coffee.kind === "drip-bag" && (
          <line x1="16" y1="46" x2="144" y2="46" stroke={c.ink} strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
        )}
      </g>
      <path d={`${crimp(16, 14, 128, 16)}`} fill="none" stroke={c.ink} strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

function roastIndex(roast?: string) {
  const order = ["light", "medium-light", "medium", "medium-dark", "dark"];
  const i = order.indexOf(roast ?? "");
  return i === -1 ? -1 : i;
}

const STAMP_INK: Record<string, string> = { cafe: "#b8322a", matcha: "#2f6b3f", shop: "#1c2744", roaster: "#7d4a26" };

/** A hanko-style visit stamp. */
export function Stamp({ place, className, size = 150 }: { place: Place; className?: string; size?: number }) {
  const ink = STAMP_INK[place.kind] ?? STAMP_INK.cafe;
  const seed = hash(place.slug);
  const rotate = (seed % 17) - 8;
  const id = `s-${place.slug}`;
  const name = place.name.length > 24 ? place.name.slice(0, 23) + "…" : place.name;
  const nameSize = name.length > 18 ? 10.5 : name.length > 12 ? 12 : 13.5;
  const area = (place.area && place.area !== place.region ? place.area : place.region) || "Japan";
  const mark = PLACE_KINDS[place.kind].ja;
  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`Visit stamp for ${place.name}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <defs>
        {/* Name runs over the top, the area under the bottom, like a station stamp. */}
        <path id={`${id}-top`} d="M22 80 A58 58 0 0 1 138 80" />
        <path id={`${id}-bottom`} d="M17 80 A63 63 0 0 0 143 80" />
        <filter id={`${id}-ink`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed % 50} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
        </filter>
      </defs>
      <g filter={`url(#${id}-ink)`} fill="none" stroke={ink} opacity="0.9">
        <circle cx="80" cy="80" r="75" strokeWidth="4" />
        <circle cx="80" cy="80" r="44" strokeWidth="1.6" />
        <g fill={ink} stroke="none">
          <circle cx="20" cy="80" r="2.6" />
          <circle cx="140" cy="80" r="2.6" />
          <text className="stamp-ring" fontSize={nameSize} letterSpacing="1">
            <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
              {name}
            </textPath>
          </text>
          <text className="stamp-ring" fontSize="10" letterSpacing="2">
            <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
              {area}
            </textPath>
          </text>
          <text x="80" y={mark.length > 1 ? 89 : 93} textAnchor="middle" className="stamp-mark" fontSize={mark.length > 1 ? 25 : 32}>
            {mark}
          </text>
        </g>
      </g>
    </svg>
  );
}

const BOARDS: Record<string, { felt: string; letters: string }> = {
  kraft: { felt: "#2a1a12", letters: "#f3e6cc" },
  green: { felt: "#24473c", letters: "#f6efe0" },
  blue: { felt: "#1c2744", letters: "#f6efe0" },
  red: { felt: "#6e1f1a", letters: "#f6efe0" },
};

/** A felt letter-board, the menu sign outside an old kissaten. */
export function LetterBoard({ guide, className }: { guide: Guide; className?: string }) {
  const board = BOARDS[guide.cover] ?? BOARDS.kraft;
  return (
    <div className={`board ${className ?? ""}`} style={{ "--felt": board.felt, "--letters": board.letters } as React.CSSProperties}>
      <span className="board-count" aria-hidden="true">
        {guide.items.length}
      </span>
      <span className="board-title">{guide.title}</span>
    </div>
  );
}

/** Cups out of five, with halves. */
export function Cups({ rating, size = 18 }: { rating?: number; size?: number }) {
  if (rating === undefined) return <span className="cups cups-none">Not rated yet</span>;
  return (
    <span className="cups" role="img" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = rating >= n ? 1 : rating >= n - 0.5 ? 0.5 : 0;
        return (
          <svg key={n} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <defs>
              <clipPath id={`half-${n}-${size}`}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            </defs>
            <path d="M4 8h13v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" fill="none" stroke="currentColor" strokeWidth="1.6" />
            {fill > 0 && (
              <path
                d="M4 8h13v6a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"
                fill="currentColor"
                clipPath={fill === 0.5 ? `url(#half-${n}-${size})` : undefined}
              />
            )}
          </svg>
        );
      })}
      <span className="cups-num">{rating}</span>
    </span>
  );
}

const AXES: { key: keyof NonNullable<Coffee["taste"]>; label: string }[] = [
  { key: "aroma", label: "Aroma" },
  { key: "acidity", label: "Acidity" },
  { key: "sweetness", label: "Sweetness" },
  { key: "body", label: "Body" },
  { key: "bitterness", label: "Bitterness" },
];

/** Five-point tasting chart, 1–5 on each axis. */
export function TasteChart({ taste }: { taste: NonNullable<Coffee["taste"]> }) {
  const cx = 130;
  const cy = 120;
  const r = 82;
  const point = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / AXES.length;
    return [cx + Math.cos(a) * r * (v / 5), cy + Math.sin(a) * r * (v / 5)];
  };
  const shape = AXES.map((axis, i) => point(i, Math.max(0, Math.min(5, taste[axis.key] ?? 0))).join(",")).join(" ");
  const summary = AXES.map((axis) => `${axis.label} ${taste[axis.key] ?? 0} of 5`).join(", ");
  return (
    <svg viewBox="0 0 260 240" className="taste" role="img" aria-label={`Tasting chart: ${summary}`}>
      {[1, 2, 3, 4, 5].map((level) => (
        <polygon
          key={level}
          points={AXES.map((_, i) => point(i, level).join(",")).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity={level === 5 ? 0.35 : 0.12}
        />
      ))}
      {AXES.map((axis, i) => {
        const [x, y] = point(i, 5);
        const [lx, ly] = point(i, 6.15);
        return (
          <g key={axis.key}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.12" />
            <text x={lx} y={ly + 4} textAnchor="middle" className="taste-label">
              {axis.label}
            </text>
          </g>
        );
      })}
      <polygon points={shape} className="taste-shape" />
      {AXES.map((axis, i) => {
        const [x, y] = point(i, taste[axis.key] ?? 0);
        return <circle key={axis.key} cx={x} cy={y} r="3.5" className="taste-dot" />;
      })}
    </svg>
  );
}

export function RoastScale({ roast }: { roast?: string }) {
  const order = ["light", "medium-light", "medium", "medium-dark", "dark"];
  const index = order.indexOf(roast ?? "");
  if (index === -1) return null;
  return (
    <span className="roast" role="img" aria-label={`Roast: ${roast?.replace("-", " ")}`}>
      {order.map((step, i) => (
        <span key={step} className="roast-step" style={{ background: ROAST_SHADE[step] }} data-on={i === index || undefined} />
      ))}
    </span>
  );
}
