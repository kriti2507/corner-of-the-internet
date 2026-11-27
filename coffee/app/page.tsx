import Link from "next/link";
import { COFFEE_KINDS, getCoffees, getGuides, getPlace, getPlaces, stats } from "@/lib/content";
import { day, yen } from "@/lib/format";
import { GuideCard, PacketLink, StampLink } from "@/components/bits";

export default function Home() {
  const coffees = getCoffees();
  const guides = getGuides();
  const places = getPlaces();
  const tally = stats();
  const latest = coffees.slice(0, 6);
  const priced = latest.filter((coffee) => coffee.price !== undefined);
  const stamped = places.filter((place) => place.kind !== "shop").slice(0, 10);
  const countWord = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <h1 id="hero-heading">Every coffee I buy in Japan, written down.</h1>
              <p className="hero-lede">
                Drip bags from Kaldi, cans from the konbini, and the cafés in Tokyo and Sapporo worth the train. Each one gets a
                page: what it tasted like, what it cost, and where to find it.
              </p>
              <p className="hero-tally">
                <strong>{countWord(tally.coffees, "coffee", "coffees")}</strong> on the shelf and{" "}
                <strong>{countWord(tally.places, "café", "cafés")}</strong> stamped so far, across{" "}
                {countWord(tally.regions, "region", "regions")}. Pick a packet to open it.
              </p>
            </div>
            <p className="hero-ja" aria-hidden="true">
              珈琲帳
            </p>
          </div>
          <div className="shelf">
            <div className="shelf-row" role="list" aria-label="The shelf">
              {coffees.map((coffee) => (
                <div role="listitem" key={coffee.slug}>
                  <PacketLink coffee={coffee} />
                </div>
              ))}
            </div>
            <div className="shelf-board" />
          </div>
        </div>
        <div className="shelf-under" />
      </section>

      <section className="section" aria-labelledby="guides-heading">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="ja-tag" lang="ja">
                おすすめ
              </span>
              <h2 id="guides-heading">Guides</h2>
              <p>Short lists for when you&apos;re standing in the shop and don&apos;t want to read every label.</p>
            </div>
            <Link className="more" href="/guides">
              All guides
            </Link>
          </div>
          <div className="boards">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="log-heading">
        <div className="wrap split">
          <div>
            <span className="ja-tag" lang="ja">
              最近
            </span>
            <h2 id="log-heading" style={{ fontSize: "var(--step-3)" }}>
              Latest from the log
            </h2>
            <p style={{ color: "var(--muted)", marginTop: "0.6rem", maxWidth: "40ch" }}>
              The receipt for my most recent coffees. Every line opens the full page with tasting notes and where I bought it.
            </p>
            <p style={{ marginTop: "1.4rem" }}>
              <Link className="more" href="/shelf">
                See the whole shelf
              </Link>
            </p>
          </div>
          <div className="receipt">
            <div className="receipt-head">
              <strong>Kriti&apos;s coffee receipt</strong>
              <span>Tokyo, kept since 2026</span>
            </div>
            <ol>
              {latest.map((coffee) => {
                const where = coffee.boughtAt ? getPlace(coffee.boughtAt)?.name : coffee.brand;
                return (
                  <li key={coffee.slug}>
                    <Link href={`/${coffee.slug}`}>
                      <span className="r-name">{coffee.name}</span>
                      <span className="r-price">{yen(coffee.price) ?? "—"}</span>
                      <span className="r-sub">
                        {[COFFEE_KINDS[coffee.kind].label, where, day(coffee.date)].filter(Boolean).join(", ")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            {priced.length > 0 && (
              <div className="receipt-total">
                <span>Total</span>
                <span>{yen(priced.reduce((sum, coffee) => sum + (coffee.price ?? 0), 0))}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="stamps-heading">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="ja-tag" lang="ja">
                スタンプ帳
              </span>
              <h2 id="stamps-heading">The stamp book</h2>
              <p>A stamp for every café and matcha bar I&apos;ve sat down in, with a map and my note from the visit.</p>
            </div>
            <Link className="more" href="/places">
              All {places.length} cafés & shops
            </Link>
          </div>
          <div className="stampbook">
            <ul className="stamps">
              {stamped.map((place) => (
                <li key={place.slug}>
                  <StampLink place={place} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
