import type { Hike } from "@/lib/hikes";
import { formatMeters } from "@/lib/format";
import { shortDay } from "@/components/hikes/hike-card";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FILL: Record<string, string> = { Hokkaido: "#c5d7ea", Tokyo: "#c9d5b0" };
const OTHER = "#f0c9a8";
const INK = "#1c2744";

/**
 * Every hike as one peak, oldest on the left. Peak height is the real summit
 * height; the darker band at the top is how much of it I climbed.
 */
export function Ridgeline({ hikes }: { hikes: Hike[] }) {
  const width = 1000;
  const height = 300;
  const base = 250;
  const top = 58;
  const pad = 42;
  const tallest = Math.max(...hikes.map((hike) => hike.heightM));
  const step = hikes.length > 1 ? (width - pad * 2) / (hikes.length - 1) : 0;
  const half = Math.max(26, Math.min(60, step * 1.25));

  const peaks = hikes.map((hike, index) => {
    const x = pad + index * step;
    const y = base - ((base - top) * hike.heightM) / tallest;
    const climbShare = Math.min(1, hike.climbedM / hike.heightM);
    const startY = y + (base - y) * climbShare;
    return { hike, index, x, y, startY };
  });

  const months: { label: string; x: number }[] = [];
  let last = "";
  for (const peak of peaks) {
    const month = peak.hike.date.slice(0, 7);
    if (month !== last) {
      months.push({ label: MONTHS[Number(month.slice(5)) - 1], x: peak.x });
      last = month;
    }
  }

  // tall peaks first, so the small ones sit in front and stay clickable
  const drawOrder = [...peaks].sort((a, b) => b.hike.heightM - a.hike.heightM);

  return (
    <figure className="sb-ridge">
      <div className="sb-ridge-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label="Every hike as a peak, in the order I climbed them">
          <line x1="0" x2={width} y1={base} y2={base} stroke={INK} strokeWidth="2" />
          {[1000, 2000].map((m) => {
            const y = base - ((base - top) * m) / tallest;
            return y > top - 10 ? (
              <g key={m}>
                <line x1="0" x2={width} y1={y} y2={y} stroke={INK} strokeOpacity="0.18" strokeDasharray="4 6" />
                <text x="4" y={y - 5} className="sb-ridge-axis">
                  {m.toLocaleString("en-US")} m
                </text>
              </g>
            ) : null;
          })}
          {drawOrder.map(({ hike, x, y, startY }) => {
            const fill = FILL[hike.region] ?? OTHER;
            const left = x - half;
            const right = x + half;
            // where the climbed line meets each side of the triangle
            const t = (startY - y) / (base - y || 1);
            const lx = x - half * t;
            const rx = x + half * t;
            return (
              <a key={hike.slug} href={`/hikes/${hike.slug}`} className="sb-peak">
                <title>{`${hike.title}, ${hike.region}, ${shortDay(hike.date)}. Summit ${formatMeters(hike.heightM)}, climbed ${formatMeters(hike.climbedM)}.`}</title>
                <path d={`M ${left} ${base} L ${x} ${y} L ${right} ${base} Z`} fill={fill} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
                <path d={`M ${lx} ${startY} L ${x} ${y} L ${rx} ${startY} Z`} fill={INK} fillOpacity="0.2" />
                <line x1={lx} x2={rx} y1={startY} y2={startY} stroke={INK} strokeWidth="1.5" strokeDasharray="3 3" />
              </a>
            );
          })}
          {peaks.map(({ hike, x, y }) => (
            <text key={hike.slug} x={x} y={y - 8} className="sb-ridge-label" transform={`rotate(-38 ${x} ${y - 8})`}>
              {hike.title}
            </text>
          ))}
          {months.map((month) => (
            <text key={`${month.label}-${month.x}`} x={month.x} y={base + 24} className="sb-ridge-month" textAnchor="middle">
              {month.label}
            </text>
          ))}
        </svg>
      </div>
      <figcaption>
        <span className="sb-key" style={{ background: FILL.Hokkaido }} /> Hokkaido
        <span className="sb-key" style={{ background: FILL.Tokyo }} /> Tokyo
        <span className="sb-key" style={{ background: OTHER }} /> elsewhere
        <span className="sb-key sb-key-climb" /> the part I climbed
      </figcaption>
    </figure>
  );
}
