import Link from "next/link";
import { PeakSketch } from "@/components/hikes/peak-sketch";
import type { Hike } from "@/lib/hikes";
import { formatDuration, formatMeters } from "@/lib/format";

const SHORT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

export function shortDay(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return SHORT.format(new Date(year, month - 1, day));
}

/** The square picture for a hike: its photo when there is one, else a sketch. */
export function HikePicture({ hike }: { hike: Hike }) {
  if (hike.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={hike.photo} alt={hike.photoAlt} loading="lazy" />;
  }
  return <PeakSketch slug={hike.slug} heightM={hike.heightM} date={hike.date} />;
}

const TAPES = ["sb-tape-yellow", "sb-tape-green", "sb-tape-pink", "sb-tape-blue"];

/** One hike as a polaroid. `index` only picks the tilt and the tape. */
export function HikePolaroid({
  hike,
  index,
  active = false,
  number,
}: {
  hike: Hike;
  index: number;
  active?: boolean;
  number?: number;
}) {
  return (
    <article
      id={`hike-${hike.slug}`}
      className="sb-polaroid sb-hike-card"
      data-tilt={(index % 5) + 1}
      data-active={active}
    >
      <span className={`sb-tape ${TAPES[index % TAPES.length]}`} aria-hidden="true" />
      <Link href={`/hikes/${hike.slug}`} className="sb-polaroid-link">
        <span className="sb-frame">
          <HikePicture hike={hike} />
          {number ? <span className="sb-number">#{number}</span> : null}
          {hike.days > 1 ? <span className="sb-badge">{hike.days} days</span> : null}
        </span>
        <span className="sb-polaroid-title">{hike.title}</span>
        <span className="sb-polaroid-script">
          {hike.region}, <time dateTime={hike.date}>{shortDay(hike.date)}</time>
        </span>
      </Link>
      <dl className="sb-mini-stats">
        <div>
          <dt>summit</dt>
          <dd>{formatMeters(hike.heightM)}</dd>
        </div>
        <div>
          <dt>climbed</dt>
          <dd>{formatMeters(hike.climbedM)}</dd>
        </div>
        <div>
          <dt>time</dt>
          <dd>{hike.durationMin == null ? "—" : formatDuration(hike.durationMin)}</dd>
        </div>
      </dl>
    </article>
  );
}
