import "@/app/weekends.css";
import "@/app/scrapbook.css";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HikeBrowser } from "@/components/hikes/hike-browser";
import { HikePicture, shortDay } from "@/components/hikes/hike-card";
import { Ridgeline } from "@/components/hikes/ridgeline";
import { weekends } from "@/content/weekends";
import { getHikes } from "@/lib/hikes";
import { formatMeters } from "@/lib/format";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("hikes");

const FUJI_M = 3776;
const MONTH = new Intl.DateTimeFormat("en-GB", { month: "long" });
/** Prefectures I count as "the ridges around Tokyo". */
const AROUND_TOKYO = ["Tokyo", "Kanagawa", "Yamanashi", "Saitama", "Chiba"];

export default function HikesPage() {
  const hikes = getHikes();
  const regions = new Set(hikes.map((hike) => hike.region)).size;
  const climbed = hikes.reduce((sum, hike) => sum + hike.climbedM, 0);
  const minutes = hikes.reduce((sum, hike) => sum + (hike.durationMin ?? 0), 0);
  const timed = hikes.filter((hike) => hike.durationMin != null).length;
  const highest = hikes.reduce((best, hike) => (hike.heightM > best.heightM ? hike : best), hikes[0]);
  const biggestDay = hikes.reduce((best, hike) => (hike.climbedM > best.climbedM ? hike : best), hikes[0]);
  const latest = hikes[hikes.length - 1];
  const hokkaido = hikes.filter((hike) => hike.region === "Hokkaido").length;
  const tokyoSide = hikes.filter((hike) => AROUND_TOKYO.includes(hike.region)).length;
  const [firstYear, firstMonth] = hikes[0].date.split("-").map(Number);
  const since = MONTH.format(new Date(firstYear, firstMonth - 1, 1));
  const fujis = (climbed / FUJI_M).toFixed(1);

  return (
    <div className="sb-scope wk-scope" data-lane="hikes">
      <section className="sb-hero-band" aria-labelledby="hikes-heading">
        <div className="wrap sb-hero">
          <div className="sb-hero-text">
            <Breadcrumbs items={[{ label: weekends.title, href: "/weekends" }, { label: weekends.lanes.hikes.label }]} />
            <p className="script sb-hello">field notes, boots still muddy ↓</p>
            <h1 id="hikes-heading" className="sb-title">
              Hikes
            </h1>
            <p className="sb-lead">
              <mark className="mark mark-green">{hikes.length} hikes</mark> since {since} and{" "}
              <mark className="mark mark-yellow">{formatMeters(climbed)} climbed</mark>: {hokkaido} in{" "}
              <mark className="mark mark-blue">Hokkaido</mark>, {tokyoSide} on{" "}
              <mark className="mark mark-pink">the ridges around Tokyo</mark>, and the rest wherever a train would take me.
            </p>
          </div>
          <div className="sb-hero-photos">
            <Link href={`/hikes/${highest.slug}`} className="sb-polaroid sb-hero-polaroid sb-hero-a">
              <span className="sb-tape sb-tape-green" aria-hidden="true" />
              <span className="sb-frame">
                <HikePicture hike={highest} />
              </span>
              <span className="sb-polaroid-script">highest so far</span>
              <span className="sb-polaroid-where">
                {highest.title}, {formatMeters(highest.heightM)}
              </span>
            </Link>
            <Link href={`/hikes/${latest.slug}`} className="sb-polaroid sb-hero-polaroid sb-hero-b">
              <span className="sb-tape sb-tape-yellow" aria-hidden="true" />
              <span className="sb-frame">
                <HikePicture hike={latest} />
              </span>
              <span className="sb-polaroid-script">latest</span>
              <span className="sb-polaroid-where">
                {latest.title}, {shortDay(latest.date)}
              </span>
            </Link>
            <svg className="sb-spark" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill="#1c2744" />
            </svg>
          </div>
        </div>
      </section>

      <section className="sb-band sb-band-cream" aria-label="Totals">
        <div className="wrap">
          <ul className="sb-stickers">
            <li className="sb-sticker tone-green" data-tilt="1">
              <span className="sb-sticker-num">{hikes.length}</span>
              <span className="sb-sticker-label">hikes across {regions} prefectures</span>
            </li>
            <li className="sb-sticker tone-yellow" data-tilt="2">
              <span className="sb-sticker-num">{formatMeters(climbed)}</span>
              <span className="sb-sticker-label">climbed, about {fujis} Mount Fujis stacked up</span>
            </li>
            <li className="sb-sticker tone-blue" data-tilt="3">
              <span className="sb-sticker-num">{Math.round(minutes / 60)} h</span>
              <span className="sb-sticker-label">
                on the trail ({timed} of {hikes.length} timed)
              </span>
            </li>
            <li className="sb-sticker tone-pink" data-tilt="4">
              <span className="sb-sticker-num">{formatMeters(biggestDay.climbedM)}</span>
              <span className="sb-sticker-label">biggest day up, on {biggestDay.title}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="sb-band sb-band-green" aria-labelledby="ridge-heading">
        <div className="wrap">
          <div className="sb-section-head">
            <p className="script kicker">the year so far</p>
            <h2 id="ridge-heading">Every hike as a peak</h2>
            <p className="lede">Oldest on the left, each drawn to its real summit height. Tap one to open it.</p>
          </div>
          <Ridgeline hikes={hikes} />
        </div>
      </section>

      <section className="sb-band sb-band-blue" aria-labelledby="log-heading">
        <div className="wrap">
          <div className="sb-section-head">
            <p className="script kicker">the log</p>
            <h2 id="log-heading">Where I&apos;ve walked</h2>
          </div>
          <HikeBrowser hikes={hikes} />
        </div>
      </section>
    </div>
  );
}
