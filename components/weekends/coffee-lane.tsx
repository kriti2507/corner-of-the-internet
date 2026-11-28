import { weekends } from "@/content/weekends";
import { coffeeHref, getCoffeeFeed, type CoffeeFeed } from "@/lib/coffee";

/**
 * The Coffee lane. Its data comes from the Coffee Notebook's feed, and its
 * links are plain <a> tags: /coffee is a separate app (see next.config.ts).
 */

const copy = weekends.lanes.coffee;

function pickGuide(feed: CoffeeFeed | null) {
  if (!feed) return null;
  return feed.guides.find((guide) => !guide.sample) ?? feed.guides[0] ?? null;
}

function Mark({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? "wk-mark wk-mark-lg" : "wk-mark"} aria-hidden="true" title={copy.markReading}>
      {copy.mark}
    </span>
  );
}

/** Home page card, the same shape as the other lanes. */
export async function CoffeeLaneCard() {
  const feed = await getCoffeeFeed();
  const guide = pickGuide(feed);
  return (
    <a className="wk-card wk-lane" data-lane="coffee" href={copy.href}>
      <div className="wk-lane-top">
        <Mark />
        <p className="wk-lane-name">{copy.label}</p>
      </div>
      <div className="wk-stat">
        {feed ? (
          <>
            <p className="wk-stat-value">
              <span className="wk-num">{feed.stats.places}</span>
              <span className="wk-unit">cafés</span>
            </p>
            <p className="wk-stat-sub">
              {feed.stats.coffees} coffees rated · {feed.guides.length} guides
            </p>
          </>
        ) : (
          <p className="wk-stat-sub">Coffees, cafés and matcha, rated.</p>
        )}
      </div>
      {guide ? (
        <div className="wk-latest">
          <p className="wk-latest-label">Guide</p>
          <p className="wk-latest-title">{guide.title}</p>
          <p className="wk-latest-meta">{guide.count} picks</p>
        </div>
      ) : (
        <div />
      )}
      <span className="wk-link">{copy.link}</span>
    </a>
  );
}

/** /weekends panel. */
export async function CoffeePanel() {
  const feed = await getCoffeeFeed();
  const guides = feed?.guides.slice(0, 2) ?? [];
  const coffees = feed?.coffees.slice(0, 4 - guides.length) ?? [];
  return (
    <article className="wk-card wk-panel" data-lane="coffee" aria-label={copy.label}>
      <div className="wk-panel-head">
        <Mark large />
        <div>
          <h2>{copy.label}</h2>
          <p>{copy.blurb}</p>
        </div>
      </div>
      {feed && (
        <dl className="wk-panel-stats">
          <div>
            <dt>cafés & matcha</dt>
            <dd className="wk-num">{feed.stats.places}</dd>
          </div>
          <div>
            <dt>coffees rated</dt>
            <dd className="wk-num">{feed.stats.coffees}</dd>
          </div>
          <div>
            <dt>guides</dt>
            <dd className="wk-num">{feed.guides.length}</dd>
          </div>
        </dl>
      )}
      <ul className="wk-rows">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <a className="wk-row" href={coffeeHref(`/guides/${guide.slug}`)}>
              <span className="wk-row-title">{guide.title}</span>
              <span className="wk-row-meta">Guide, {guide.count} picks</span>
            </a>
          </li>
        ))}
        {coffees.map((coffee) => (
          <li key={coffee.slug}>
            <a className="wk-row" href={coffeeHref(`/${coffee.slug}`)}>
              <span className="wk-row-title">{coffee.name}</span>
              <span className="wk-row-meta">{[coffee.kind, coffee.brand].filter(Boolean).join(", ")}</span>
            </a>
          </li>
        ))}
      </ul>
      <a className="wk-link" href={copy.href}>
        {copy.link}
      </a>
    </article>
  );
}
