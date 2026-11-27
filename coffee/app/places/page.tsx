import type { Metadata } from "next";
import { PLACE_KINDS, getPlaces, type PlaceKind } from "@/lib/content";
import { Crumbs, StampLink } from "@/components/bits";

export const metadata: Metadata = {
  title: "Cafés & shops",
  description: "The cafés, matcha bars and coffee shops Kriti has been to in Tokyo, Sapporo and around Japan, each with a map and a note.",
  alternates: { canonical: "/coffee/places" },
};

const ORDER: PlaceKind[] = ["cafe", "matcha", "roaster", "shop"];

export default function PlacesPage() {
  const places = getPlaces();
  const regions = [...new Set(places.map((place) => place.region))];

  return (
    <div className="wrap">
      <header className="page-head">
        <Crumbs items={[{ label: "Cafés & shops" }]} />
        <span className="ja-tag" lang="ja">
          スタンプ帳
        </span>
        <h1>The stamp book</h1>
        <p>
          {places.length} places across {regions.length} regions. Every stamp opens a page with a map, my note, and whatever I
          ordered there.
        </p>
      </header>
      {ORDER.filter((kind) => places.some((place) => place.kind === kind)).map((kind) => {
        const group = places.filter((place) => place.kind === kind);
        return (
          <section key={kind} className="section" style={{ paddingTop: 0 }} aria-labelledby={`kind-${kind}`}>
            <div className="section-head">
              <div>
                <span className="ja-tag" lang="ja">
                  {PLACE_KINDS[kind].ja}
                </span>
                <h2 id={`kind-${kind}`}>{PLACE_KINDS[kind].plural}</h2>
              </div>
            </div>
            <div className="stampbook">
              {regions
                .filter((region) => group.some((place) => place.region === region))
                .map((region) => (
                  <div key={region} style={{ marginBottom: "1.4rem" }}>
                    <h3 className="hand" style={{ fontFamily: "var(--hand)", fontWeight: 500, marginBottom: "0.6rem" }}>
                      {region}
                    </h3>
                    <ul className="stamps">
                      {group
                        .filter((place) => place.region === region)
                        .map((place) => (
                          <li key={place.slug}>
                            <StampLink place={place} />
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
