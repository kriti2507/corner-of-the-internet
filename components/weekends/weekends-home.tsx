import Link from "next/link";
import "@/app/weekends.css";
import { placeWhere, kindLabel } from "@/content/places";
import { weekends } from "@/content/weekends";
import { formatDay, formatMeters } from "@/lib/format";
import type { WeekendSummary } from "@/lib/weekends";

function LaneTop({ lane }: { lane: keyof typeof weekends.lanes }) {
  const copy = weekends.lanes[lane];
  return (
    <div className="wk-lane-top">
      <span className="wk-mark" aria-hidden="true" title={copy.markReading}>
        {copy.mark}
      </span>
      <p className="wk-lane-name">{copy.label}</p>
    </div>
  );
}

/** The Weekends block on the home page: four lanes, one number and one latest entry each. */
export function WeekendsHome({ summary }: { summary: WeekendSummary }) {
  const { hikes, reading, places, japanese } = summary;
  const hike = hikes.recent[0];
  const book = reading.recent[0];
  const place = places.featured;
  const word = japanese.word;
  const kinds = places.kinds.slice(0, 3).map((kind) => `${kind.count} ${kind.plural.toLowerCase()}`);

  return (
    <section className="band wk-scope" id="weekends" aria-labelledby="weekends-heading">
      <div className="wrap">
        <div className="wk-head">
          <p className="script kicker">{weekends.kicker}</p>
          <div className="wk-head-row">
            <h2 id="weekends-heading">{weekends.title}</h2>
            <Link className="text-link" href="/weekends">
              {weekends.seeAll}
            </Link>
          </div>
          <p className="lede">{weekends.lede}</p>
        </div>

        <ul className="wk-lanes">
          <li>
            <Link className="wk-card wk-lane" data-lane="hikes" href={weekends.lanes.hikes.href}>
              <LaneTop lane="hikes" />
              <div className="wk-stat">
                <p className="wk-stat-value">
                  <span className="wk-num">{hikes.count}</span>
                  <span className="wk-unit">hikes</span>
                </p>
                <p className="wk-stat-sub">{formatMeters(hikes.climbed)} climbed</p>
              </div>
              {hike ? (
                <div className="wk-latest">
                  <p className="wk-latest-label">Latest</p>
                  <p className="wk-latest-title">{hike.title}</p>
                  <p className="wk-latest-meta">
                    {hike.region} · <time dateTime={hike.date}>{formatDay(hike.date)}</time> · {formatMeters(hike.climbedM)} up
                  </p>
                </div>
              ) : null}
              <span className="wk-link">{weekends.lanes.hikes.link}</span>
            </Link>
          </li>

          <li>
            <Link className="wk-card wk-lane" data-lane="reading" href={weekends.lanes.reading.href}>
              <LaneTop lane="reading" />
              <div className="wk-stat">
                <p className="wk-stat-value">
                  <span className="wk-num">{reading.count}</span>
                  <span className="wk-unit">books</span>
                </p>
                <p className="wk-stat-sub">
                  {reading.topSeries ? `${reading.topSeries[1]} from the ${reading.topSeries[0]}` : "read this year"}
                </p>
              </div>
              {book ? (
                <div className="wk-latest">
                  <p className="wk-latest-label">Latest</p>
                  <p className="wk-latest-title">{book.title}</p>
                  <p className="wk-latest-meta">{book.author}</p>
                </div>
              ) : null}
              <span className="wk-link">{weekends.lanes.reading.link}</span>
            </Link>
          </li>

          <li>
            <Link className="wk-card wk-lane" data-lane="places" href={weekends.lanes.places.href}>
              <LaneTop lane="places" />
              <div className="wk-stat">
                <p className="wk-stat-value">
                  <span className="wk-num">{places.count}</span>
                  <span className="wk-unit">places</span>
                </p>
                <p className="wk-stat-sub">{kinds.join(" · ")}</p>
              </div>
              {place ? (
                <div className="wk-latest">
                  <p className="wk-latest-label">{kindLabel(place.kind)} pick</p>
                  <p className="wk-latest-title">{place.name}</p>
                  {place.myNote ? <p className="wk-quote">{place.note}</p> : <p className="wk-latest-meta">{placeWhere(place)}</p>}
                </div>
              ) : null}
              <span className="wk-link">{weekends.lanes.places.link}</span>
            </Link>
          </li>

          <li>
            <Link className="wk-card wk-lane" data-lane="japanese" href={weekends.lanes.japanese.href}>
              <LaneTop lane="japanese" />
              <div className="wk-stat">
                <p className="wk-stat-value">
                  <span className="wk-num">{japanese.current}</span>
                  <span className="wk-unit">{japanese.currentNote}</span>
                </p>
                <p className="wk-stat-sub">
                  {japanese.next} next, {japanese.nextNote}
                </p>
              </div>
              {word ? (
                <div className="wk-latest">
                  <p className="wk-latest-label">Word from the weekends</p>
                  <p className="wk-word">
                    <span className="wk-word-ja" lang="ja">{word.ja}</span>
                    <span className="wk-latest-meta">{word.romaji}</span>
                  </p>
                  <p className="wk-latest-meta">{word.en}</p>
                </div>
              ) : null}
              <span className="wk-link">{weekends.lanes.japanese.link}</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
