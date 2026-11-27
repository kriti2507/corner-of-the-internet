import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  COFFEE_KINDS,
  SITE,
  coffeesAt,
  getCoffee,
  getCoffees,
  getPlace,
  guidesMentioning,
  mapsLink,
  placeWhere,
} from "@/lib/content";
import { day, titleCase, yen } from "@/lib/format";
import { Cups, Packet, RoastScale, TasteChart } from "@/components/art";
import { CoffeeCaption, Crumbs, Gallery, GuideCard, PacketLink, PinIcon, SampleNote } from "@/components/bits";
import { Comments } from "@/components/comments";

export function generateStaticParams() {
  return getCoffees().map((coffee) => ({ slug: coffee.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const coffee = getCoffee(slug);
  if (!coffee) return {};
  const title = coffee.brand && !coffee.name.includes(coffee.brand) ? `${coffee.name} (${coffee.brand})` : coffee.name;
  const description =
    coffee.summary ??
    `${COFFEE_KINDS[coffee.kind].label} ${coffee.brand ? `from ${coffee.brand}` : ""}, reviewed by Kriti in Tokyo.`.replace(/\s+/g, " ");
  return {
    title,
    description,
    alternates: { canonical: `/coffee/${slug}` },
    openGraph: { title, description, url: `/coffee/${slug}`, type: "article", images: coffee.photos[0] ? [coffee.photos[0].src] : undefined },
    robots: coffee.sample ? { index: false } : undefined,
  };
}

const AGAIN = {
  yes: { big: "Buy again", small: "would buy again" },
  maybe: { big: "Maybe", small: "might buy again" },
  no: { big: "Skip it", small: "wouldn't buy again" },
};

export default async function CoffeePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coffee = getCoffee(slug);
  if (!coffee) {
    // Old heykriti.com/coffee/<café> links land on the café's page.
    if (getPlace(slug)) permanentRedirect(`/places/${slug}`);
    notFound();
  }

  const place = coffee.boughtAt ? getPlace(coffee.boughtAt) : null;
  const guides = guidesMentioning(coffee.slug, "coffee");
  const siblings = place ? coffeesAt(place.slug).filter((other) => other.slug !== coffee.slug) : [];
  const where = place ? placeWhere(place) : undefined;
  const mapHref = mapsLink(place?.name ?? coffee.brand ?? coffee.name, where, coffee.mapUrl ?? place?.mapUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${coffee.name} review`,
    author: { "@type": "Person", name: SITE.owner, url: SITE.home },
    datePublished: coffee.date,
    reviewBody: coffee.summary,
    itemReviewed: {
      "@type": "Product",
      name: coffee.name,
      brand: coffee.brand ? { "@type": "Brand", name: coffee.brand } : undefined,
      offers: coffee.price ? { "@type": "Offer", price: coffee.price, priceCurrency: "JPY" } : undefined,
    },
    reviewRating: coffee.rating !== undefined ? { "@type": "Rating", ratingValue: coffee.rating, bestRating: 5, worstRating: 1 } : undefined,
  };

  return (
    <article className="detail">
      {!coffee.sample && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      <div className="wrap">
        <Crumbs items={[{ label: "The shelf", href: "/shelf" }, { label: coffee.name }]} />
        <div className="detail-grid">
          <div style={{ position: "relative" }}>
            {coffee.photos.length > 0 ? (
              <Gallery photos={coffee.photos} />
            ) : (
              <div className="detail-art">
                <Packet coffee={coffee} />
                <div className="shelf-board" />
              </div>
            )}
            {coffee.again && (
              <p className="verdict" data-again={coffee.again}>
                <span>
                  {AGAIN[coffee.again].big}
                  <small>{AGAIN[coffee.again].small}</small>
                </span>
              </p>
            )}
          </div>

          <div className="detail-head">
            {coffee.sample && <SampleNote what="entry" />}
            <h1 style={{ marginTop: coffee.sample ? "1rem" : 0 }}>{coffee.name}</h1>
            {coffee.nameJa && (
              <p className="detail-ja" lang="ja">
                {coffee.nameJa}
              </p>
            )}
            <p className="detail-brand">
              {[COFFEE_KINDS[coffee.kind].label, coffee.brand].filter(Boolean).join(" from ")}
            </p>
            <div className="detail-rating">
              <Cups rating={coffee.rating} size={26} />
            </div>
            {coffee.summary && <p className="detail-summary">{coffee.summary}</p>}

            <dl className="facts">
              {coffee.price !== undefined && (
                <div>
                  <dt>Paid</dt>
                  <dd>
                    {yen(coffee.price)}
                    {coffee.priceNote && <span style={{ fontWeight: 400 }}> for {coffee.priceNote}</span>}
                  </dd>
                </div>
              )}
              {place && (
                <div>
                  <dt>Bought at</dt>
                  <dd>
                    <Link href={`/places/${place.slug}`}>{place.name}</Link>
                  </dd>
                </div>
              )}
              {coffee.date && (
                <div>
                  <dt>Tried</dt>
                  <dd>{day(coffee.date)}</dd>
                </div>
              )}
              {coffee.origin.length > 0 && (
                <div>
                  <dt>Origin</dt>
                  <dd>{coffee.origin.join(", ")}</dd>
                </div>
              )}
              {coffee.roast && (
                <div>
                  <dt>Roast, {coffee.roast.replace("-", " ")}</dt>
                  <dd>
                    <RoastScale roast={coffee.roast} />
                  </dd>
                </div>
              )}
              {coffee.process && (
                <div>
                  <dt>Process</dt>
                  <dd>{coffee.process}</dd>
                </div>
              )}
            </dl>

            <div className="actions">
              <a className="btn" href={mapHref} target="_blank" rel="noreferrer">
                <PinIcon />
                {place ? `Find ${place.name} on the map` : "Find it on the map"}
              </a>
              {coffee.tags.map((tag) => (
                <Link key={tag} className="chip" href={`/shelf?tag=${encodeURIComponent(tag)}`} style={{ alignSelf: "center" }}>
                  {titleCase(tag)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {(coffee.taste || coffee.notes.length > 0 || coffee.brew) && (
          <section className="tasting" aria-labelledby="tasting-heading">
            {coffee.taste ? <TasteChart taste={coffee.taste} /> : <div />}
            <div>
              <h2 id="tasting-heading">How it tastes</h2>
              {coffee.notes.length > 0 && (
                <ul className="flavours" aria-label="Flavour notes">
                  {coffee.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              )}
              {coffee.brew && (
                <div className="brew">
                  <h3 style={{ fontSize: "var(--step-1)" }}>How I brew it</h3>
                  <dl>
                    {coffee.brew.method && (
                      <>
                        <dt>Method</dt>
                        <dd>{coffee.brew.method}</dd>
                      </>
                    )}
                    {coffee.brew.dose && (
                      <>
                        <dt>Coffee</dt>
                        <dd>{coffee.brew.dose}</dd>
                      </>
                    )}
                    {coffee.brew.water && (
                      <>
                        <dt>Water</dt>
                        <dd>{coffee.brew.water}</dd>
                      </>
                    )}
                    {coffee.brew.time && (
                      <>
                        <dt>Pour</dt>
                        <dd>{coffee.brew.time}</dd>
                      </>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </section>
        )}

        {coffee.html && <div className="prose" dangerouslySetInnerHTML={{ __html: coffee.html }} />}

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

        {place && siblings.length > 0 && (
          <section className="related" aria-labelledby="more-from">
            <h2 id="more-from">More from {place.name}</h2>
            <ul className="shelf-grid">
              {siblings.map((other) => (
                <li key={other.slug}>
                  <PacketLink coffee={other} tag={false} />
                  <CoffeeCaption coffee={other} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <Comments pageKey={`coffee:${coffee.slug}`} title={coffee.name} />
      </div>
    </article>
  );
}
