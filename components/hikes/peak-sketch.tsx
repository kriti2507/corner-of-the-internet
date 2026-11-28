import { seasonFor } from "@/lib/slug";

/**
 * A hand-drawn-style mountain for a hike that has no photo yet.
 * The peak's height follows the real summit height, the sky follows the
 * season of the logged date, and the slug nudges the shape so no two match.
 */

const SKY = { spring: "#f4c9c4", summer: "#c5d7ea", autumn: "#f0c9a8", winter: "#dde7ee" } as const;
const TREE = { spring: "#e58fa3", summer: "#4f8a73", autumn: "#c56a4a", winter: "#8aa0b8" } as const;
const INK = "#1c2744";

function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function PeakSketch({
  slug,
  heightM,
  date,
  className = "sketch",
}: {
  slug: string;
  heightM: number;
  date: string;
  className?: string;
}) {
  const season = seasonFor(date);
  const h = hash(slug);
  const base = 214;
  const share = Math.min(1, Math.max(0.16, heightM / 2600));
  const peakX = 92 + (h % 56);
  const peakY = Math.round(base - share * 158);
  const leftShoulder = { x: peakX - 46 - ((h >> 4) % 18), y: Math.round(peakY + (base - peakY) * (0.42 + ((h >> 8) % 12) / 100)) };
  const rightShoulder = { x: peakX + 50 + ((h >> 12) % 20), y: Math.round(peakY + (base - peakY) * (0.3 + ((h >> 16) % 14) / 100)) };
  const sunX = peakX > 120 ? 52 + ((h >> 3) % 24) : 168 + ((h >> 3) % 30);
  const snow = heightM >= 1700;
  const trees = [18, 40, 196, 220].map((x, i) => ({ x: x + ((h >> (i * 3)) % 9), y: 204 + ((h >> (i * 2)) % 6) }));

  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="240" height="240" fill={SKY[season]} />
      {season === "winter" ? null : (
        <circle cx={sunX} cy={48 + ((h >> 5) % 16)} r="15" fill="#fffdf8" stroke={INK} strokeWidth="3" />
      )}
      <path
        d={`M-6 ${base - 34} Q 40 ${base - 58} 86 ${base - 30} T 180 ${base - 40} T 250 ${base - 28} L 250 240 L -6 240 Z`}
        fill="#c9d5b0"
        stroke={INK}
        strokeWidth="2"
        opacity="0.9"
      />
      <path
        d={`M-6 ${base + 8} L ${leftShoulder.x} ${leftShoulder.y} L ${peakX - 12} ${peakY + 16} L ${peakX} ${peakY} L ${peakX + 14} ${peakY + 12} L ${rightShoulder.x} ${rightShoulder.y} L 250 ${base + 4} L 250 240 L -6 240 Z`}
        fill="#f4efe6"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {snow ? (
        <path
          d={`M ${peakX} ${peakY} L ${peakX + 14} ${peakY + 12} L ${peakX + 9} ${peakY + 22} L ${peakX + 2} ${peakY + 16} L ${peakX - 5} ${peakY + 24} L ${peakX - 12} ${peakY + 16} Z`}
          fill="#fffdf8"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : null}
      <path d={`M ${peakX} ${peakY} V ${peakY - 20}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M ${peakX} ${peakY - 20} L ${peakX + 15} ${peakY - 15} L ${peakX} ${peakY - 10} Z`} fill="#efd15f" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {season === "winter"
        ? null
        : trees.map((tree, i) => (
            <path
              key={i}
              d={`M ${tree.x} ${tree.y - 16} L ${tree.x + 7} ${tree.y} L ${tree.x - 7} ${tree.y} Z`}
              fill={TREE[season]}
              stroke={INK}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          ))}
    </svg>
  );
}
