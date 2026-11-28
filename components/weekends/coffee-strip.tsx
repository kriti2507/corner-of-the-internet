import { coffeeHref, getCoffeeFeed } from "@/lib/coffee";

/**
 * The Coffee Notebook lives in its own app at /coffee. This strip sits under
 * the Weekends lanes (inside the Weekends section, so it shares its padding)
 * on the home page and on /weekends, and reads the
 * notebook's feed so the numbers and guides stay in step with it.
 */
export async function CoffeeStrip() {
  const feed = await getCoffeeFeed();
  const guides = feed?.guides.slice(0, 3) ?? [];
  const latest = feed?.coffees[0];

  return (
    <div className="wk-coffee">
        <a className="wk-coffee-main" href={coffeeHref()}>
          <span className="wk-coffee-ja" lang="ja" aria-hidden="true">
            珈琲帳
          </span>
          <span className="wk-coffee-title">The Coffee Notebook</span>
          <span className="wk-coffee-sub">
            {feed
              ? `${feed.stats.coffees} coffees and ${feed.stats.places} cafés so far, each with a page, a map and a place to leave a note.`
              : "Every coffee I buy in Japan, with a page, a map and a place to leave a note."}
          </span>
          <span className="wk-coffee-link">Open the notebook</span>
        </a>
        {(guides.length > 0 || latest) && (
          <ul className="wk-coffee-list">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <a href={coffeeHref(`/guides/${guide.slug}`)}>
                  <span className="wk-coffee-item">{guide.title}</span>
                  <span className="wk-coffee-meta">Guide, {guide.count} picks</span>
                </a>
              </li>
            ))}
            {latest && (
              <li>
                <a href={coffeeHref(`/${latest.slug}`)}>
                  <span className="wk-coffee-item">{latest.name}</span>
                  <span className="wk-coffee-meta">Latest on the shelf{latest.brand ? `, ${latest.brand}` : ""}</span>
                </a>
              </li>
            )}
          </ul>
        )}
    </div>
  );
}
