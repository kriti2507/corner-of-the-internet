import Link from "next/link";
import "@/app/weekends.css";
import { placeWhere } from "@/content/places";
import { japanese, weekends, type LaneId } from "@/content/weekends";
import { formatDay, formatMeters } from "@/lib/format";
import { pageMetadata } from "@/lib/page-meta";
import { weekendSummary } from "@/lib/weekends";

export const metadata = pageMetadata("weekends");

function PanelHead({ lane }: { lane: LaneId }) {
  const copy = weekends.lanes[lane];
  return (
    <div className="wk-panel-head">
      <span className="wk-mark wk-mark-lg" aria-hidden="true" title={copy.markReading}>
        {copy.mark}
      </span>
      <div>
        <h2>{copy.label}</h2>
        <p>{copy.blurb}</p>
      </div>
    </div>
  );
}

export default function WeekendsPage() {
  const { hikes, reading, places } = weekendSummary();

  return (
    <section className="band wk-scope" aria-labelledby="weekends-hub-heading">
      <div className="wrap">
        <div className="wk-head">
          <p className="script kicker">{weekends.kicker}</p>
          <h1 id="weekends-hub-heading">{weekends.title}</h1>
          <p className="lede">{weekends.lede}</p>
        </div>

        <div className="wk-hub">
          <article className="wk-card wk-panel" data-lane="hikes" aria-label={weekends.lanes.hikes.label}>
            <PanelHead lane="hikes" />
            <dl className="wk-panel-stats">
              <div>
                <dt>hikes</dt>
                <dd className="wk-num">{hikes.count}</dd>
              </div>
              <div>
                <dt>climbed</dt>
                <dd className="wk-num">{formatMeters(hikes.climbed)}</dd>
              </div>
              <div>
                <dt>highest, {hikes.highest.title}</dt>
                <dd className="wk-num">{formatMeters(hikes.highest.heightM)}</dd>
              </div>
            </dl>
            <ul className="wk-rows">
              {hikes.recent.slice(0, 4).map((hike) => (
                <li key={hike.slug}>
                  <Link className="wk-row" href={`/hikes/${hike.slug}`}>
                    <span className="wk-row-title">{hike.title}</span>
                    <span className="wk-row-meta">
                      {hike.region} · <time dateTime={hike.date}>{formatDay(hike.date)}</time>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="wk-link" href={weekends.lanes.hikes.href}>
              {weekends.lanes.hikes.link}
            </Link>
          </article>

          <article className="wk-card wk-panel" data-lane="reading" aria-label={weekends.lanes.reading.label}>
            <PanelHead lane="reading" />
            <dl className="wk-panel-stats">
              <div>
                <dt>books this year</dt>
                <dd className="wk-num">{reading.count}</dd>
              </div>
              {reading.topSeries ? (
                <div>
                  <dt>from the {reading.topSeries[0]}</dt>
                  <dd className="wk-num">{reading.topSeries[1]}</dd>
                </div>
              ) : null}
            </dl>
            <ul className="wk-rows">
              {reading.recent.slice(0, 4).map((book) => (
                <li key={book.slug}>
                  <Link className="wk-row" href={`/books/${book.slug}`}>
                    <span className="wk-row-title">{book.title}</span>
                    <span className="wk-row-meta">{book.author}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="wk-link" href={weekends.lanes.reading.href}>
              {weekends.lanes.reading.link}
            </Link>
          </article>

          <article className="wk-card wk-panel" data-lane="places" aria-label={weekends.lanes.places.label}>
            <PanelHead lane="places" />
            <dl className="wk-panel-stats">
              {places.kinds.map((kind) => (
                <div key={kind.id}>
                  <dt>{kind.plural.toLowerCase()}</dt>
                  <dd className="wk-num">{kind.count}</dd>
                </div>
              ))}
            </dl>
            <ul className="wk-rows">
              {places.noted.slice(0, 4).map((place) => (
                <li key={place.slug}>
                  <Link className="wk-row" href={`/places/${place.slug}`}>
                    <span className="wk-row-title">{place.name}</span>
                    <span className="wk-row-meta">{placeWhere(place)}</span>
                    <span className="wk-row-sub">“{place.note}”</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="wk-link" href={weekends.lanes.places.href}>
              {weekends.lanes.places.link}
            </Link>
          </article>

          <article className="wk-card wk-panel" data-lane="japanese" aria-label={weekends.lanes.japanese.label}>
            <PanelHead lane="japanese" />
            <ol className="wk-ladder" aria-label="JLPT levels">
              {japanese.levels.map((level) => (
                <li key={level.id} data-status={level.status}>
                  <b>{level.id}</b>
                  {level.id === japanese.current ? japanese.currentNote : level.status === "done" ? "✓" : level.status === "next" ? "next" : ""}
                </li>
              ))}
            </ol>
            <p className="wk-muted" style={{ margin: 0 }}>
              {japanese.status.join(" ")}
            </p>
            <ul className="wk-rows">
              {japanese.words.slice(0, 3).map((word) => (
                <li key={word.ja}>
                  <div className="wk-row">
                    <span className="wk-row-title">
                      <span lang="ja">{word.ja}</span> · {word.romaji}
                    </span>
                    <span className="wk-row-meta">{word.en}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link className="wk-link" href={weekends.lanes.japanese.href}>
              {weekends.lanes.japanese.link}
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
