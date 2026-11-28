import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLACE_KINDS, SITE, coffeesAt, getPlace, getPlaces, guidesMentioning, mapsLink, placeWhere, sectionsFor } from "@/lib/content";
import { day, titleCase } from "@/lib/format";
import { Cups, Stamp } from "@/components/art";
import { CoffeeCaption, Crumbs, Gallery, GuideCard, MapEmbed, PacketLink, PinIcon, SampleNote, SectionChips } from "@/components/bits";
import { Comments } from "@/components/comments";

export function generateStaticParams() {
  return getPlaces().map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return {};
  const description = place.note ?? `${PLACE_KINDS[place.kind].label} in ${placeWhere(place)}, with a map and Kriti's notes.`;
  return {
    title: `${place.name}, ${placeWhere(place)}`,
    description,
    alternates: { canonical: `/coffee/places/${slug}` },
    openGraph: { title: place.name, description, url: `/coffee/places/${slug}`, images: place.photos[0] ? [place.photos[0].src] : undefined },
    robots: place.sample ? { index: false } : undefined,
  };
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const where = placeWhere(place);
  const href = mapsLink(place.name, where, place.mapUrl);
  const ordered = coffeesAt(place.slug);
  const guides = guidesMentioning(place.slug, "place");
  const isChain = place.kind === "shop" && place.lat === undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": place.kind === "shop" ? "Store" : "CafeOrCoffeeShop",
    name: place.name,
    address: { "@type": "PostalAddress", addressLocality: place.area || place.region, addressRegion: place.region, addressCountry: "JP" },
    geo: place.lat !== undefined ? { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } : undefined,
    hasMap: href,
    review:
      place.note && place.myNote
        ? { "@type": "Review", author: { "@type": "Person", name: SITE.owner }, reviewBody: place.note, reviewRating: place.rating ? { "@type": "Rating", ratingValue: place.rating, bestRating: 5 } : undefined }
        : undefined,
  };

  return (
    <article className="detail">
      {!place.sample && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      <div className="wrap">
        <Crumbs items={[{ label: "Cafés & shops", href: "/places" }, { label: place.name }]} />
        <div className="detail-grid">
          {place.photos.length > 0 ? (
            <Gallery photos={place.photos} />
          ) : (
            <div className="detail-art-place">
              <Stamp place={place} size={280} />
            </div>
          )}
          <div className="detail-head">
            {place.sample && <SampleNote what="write-up" />}
            <h1 style={{ marginTop: place.sample ? "1rem" : 0 }}>{place.name}</h1>
            {place.nameJa && (
              <p className="detail-ja" lang="ja">
                {place.nameJa}
              </p>
            )}
            <p className="detail-brand">
              {PLACE_KINDS[place.kind].label} in {where}
            </p>
            <div className="detail-rating">
              <Cups rating={place.rating} size={26} />
            </div>
            {place.note &&
              (place.myNote ? (
                <>
                  <p className="quote-note">{place.note}</p>
                  <p className="quote-attr">My note from the visit</p>
                </>
              ) : (
                <p className="plain-note">{place.note}</p>
              ))}

            <dl className="facts">
              <div>
                <dt>Where</dt>
                <dd>{place.address ?? where}</dd>
              </div>
              {place.visited && (
                <div>
                  <dt>Visited</dt>
                  <dd>{day(place.visited)}</dd>
                </div>
              )}
              {ordered.length > 0 && (
                <div>
                  <dt>{place.kind === "shop" ? "Bought here" : "Ordered here"}</dt>
                  <dd>
                    {ordered.length} {ordered.length === 1 ? "coffee" : "coffees"}
                  </dd>
                </div>
              )}
            </dl>
            <div className="actions">
              <a className="btn" href={href} target="_blank" rel="noreferrer">
                <PinIcon />
                {isChain ? "Find the nearest one" : "Open in Google Maps"}
              </a>
              <SectionChips sections={sectionsFor(place)} />
              {place.tags.map((tag) => (
                <span key={tag} className="chip" style={{ alignSelf: "center" }}>
                  {titleCase(tag)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {place.html && <div className="prose" dangerouslySetInnerHTML={{ __html: place.html }} />}

        {!isChain && <MapEmbed name={place.name} area={where} lat={place.lat} lng={place.lng} href={href} />}

        {ordered.length > 0 && (
          <section className="related" aria-labelledby="ordered">
            <h2 id="ordered">{place.kind === "shop" ? "What I've bought here" : "What I ordered"}</h2>
            <ul className="shelf-grid">
              {ordered.map((coffee) => (
                <li key={coffee.slug}>
                  <PacketLink coffee={coffee} tag={false} />
                  <CoffeeCaption coffee={coffee} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {guides.length > 0 && (
          <section className="related" aria-labelledby="in-guides">
            <h2 id="in-guides">In these guides</h2>
            <div className="boards">
              {guides.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        )}

        <p style={{ marginTop: "2.5rem" }}>
          <Link className="more" href="/places">
            Back to the stamp book
          </Link>
        </p>

        <Comments pageKey={`place:${place.slug}`} title={place.name} />
      </div>
    </article>
  );
}
