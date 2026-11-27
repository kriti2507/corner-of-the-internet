import type { Metadata } from "next";
import { Suspense } from "react";
import { COFFEE_KINDS, getCoffees } from "@/lib/content";
import { CoffeeCaption, Crumbs, PacketLink } from "@/components/bits";
import { ShelfBrowser } from "@/components/shelf-browser";

export const metadata: Metadata = {
  title: "The shelf",
  description: "Every drip bag, bag of beans, can and café cup Kriti has bought in Japan, with ratings and prices.",
  alternates: { canonical: "/coffee/shelf" },
};

export default function ShelfPage() {
  const coffees = getCoffees();
  const cards = Object.fromEntries(
    coffees.map((coffee) => [
      coffee.slug,
      <>
        <PacketLink coffee={coffee} tag={false} />
        <CoffeeCaption coffee={coffee} />
      </>,
    ]),
  );
  const items = coffees.map((coffee) => ({
    slug: coffee.slug,
    name: coffee.name,
    kind: coffee.kind,
    kindLabel: COFFEE_KINDS[coffee.kind].label,
    tags: coffee.tags,
    rating: coffee.rating,
    price: coffee.price,
    date: coffee.date,
  }));
  const kinds = Object.entries(COFFEE_KINDS).map(([id, value]) => ({ id, label: value.plural }));

  return (
    <div className="wrap">
      <header className="page-head">
        <Crumbs items={[{ label: "The shelf" }]} />
        <span className="ja-tag" lang="ja">
          棚
        </span>
        <h1>The shelf</h1>
        <p>Everything I&apos;ve bought and drunk, newest first. Filter by kind or tag, or sort by rating to see the winners.</p>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        <Suspense
          fallback={
            <ul className="shelf-grid">
              {coffees.map((coffee) => (
                <li key={coffee.slug}>{cards[coffee.slug]}</li>
              ))}
            </ul>
          }
        >
          <ShelfBrowser items={items} cards={cards} kinds={kinds} />
        </Suspense>
      </section>
    </div>
  );
}
