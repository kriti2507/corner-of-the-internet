import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COFFEE_KINDS, SITE, getCoffee, getGuide, getGuides, getPlace, mapsLink, placeWhere } from "@/lib/content";
import { monthYear, yen } from "@/lib/format";
import { Cups, LetterBoard, Packet, Stamp } from "@/components/art";
import { Crumbs, SampleNote } from "@/components/bits";
import { Comments } from "@/components/comments";

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.summary,
    alternates: { canonical: `/coffee/guides/${slug}` },
    openGraph: { title: guide.title, description: guide.summary, url: `/coffee/guides/${slug}`, type: "article" },
    robots: guide.sample ? { index: false } : undefined,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const shop = guide.place ? getPlace(guide.place) : null;

  const entries = guide.items
    .map((item) => {
      if (item.coffee) {
        const coffee = getCoffee(item.coffee);
        return coffee ? { kind: "coffee" as const, coffee, note: item.note } : null;
      }
      const place = item.place ? getPlace(item.place) : null;
      return place ? { kind: "place" as const, place, note: item.note } : null;
    })
    .filter((entry) => entry !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guide.title,
    description: guide.summary,
    author: { "@type": "Person", name: SITE.owner, url: SITE.home },
    itemListElement: entries.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: entry.kind === "coffee" ? entry.coffee.name : entry.place.name,
      url: entry.kind === "coffee" ? `${SITE.url}/${entry.coffee.slug}` : `${SITE.url}/places/${entry.place.slug}`,
    })),
  };

  return (
    <article>
      {!guide.sample && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}
      <div className="wrap guide-hero">
        <Crumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
        <LetterBoard guide={guide} />
        <h1 className="sr-only">{guide.title}</h1>
        <div className="guide-intro">
          <div>
            {guide.sample && (
              <p style={{ marginBottom: "1rem" }}>
                <SampleNote what="guide" />
              </p>
            )}
            {guide.summary && <p className="detail-summary">{guide.summary}</p>}
          </div>
          <div style={{ color: "var(--muted)", fontSize: "var(--step--1)" }}>
            {guide.date && <p>Updated {monthYear(guide.date)}</p>}
            {shop && (
              <p style={{ marginTop: "0.3rem" }}>
                All from <Link href={`/places/${shop.slug}`}>{shop.name}</Link>
              </p>
            )}
          </div>
        </div>
        {guide.html && <div className="prose" style={{ marginTop: "1.5rem" }} dangerouslySetInnerHTML={{ __html: guide.html }} />}

        <ol className="picks">
          {entries.map((entry) =>
            entry.kind === "coffee" ? (
              <li key={entry.coffee.slug} className="pick">
                <Link href={`/${entry.coffee.slug}`} className="pick-art" tabIndex={-1} aria-hidden="true">
                  <Packet coffee={entry.coffee} />
                </Link>
                <div className="pick-body">
                  <h3>
                    <Link href={`/${entry.coffee.slug}`}>{entry.coffee.name}</Link>
                  </h3>
                  <p className="pick-sub">
                    {[COFFEE_KINDS[entry.coffee.kind].label, entry.coffee.nameJa, entry.coffee.priceNote].filter(Boolean).join(", ")}
                  </p>
                  {(entry.note ?? entry.coffee.summary) && <p className="pick-note">{entry.note ?? entry.coffee.summary}</p>}
                  <div className="pick-meta">
                    <Cups rating={entry.coffee.rating} size={17} />
                    {entry.coffee.price !== undefined && <strong>{yen(entry.coffee.price)}</strong>}
                    <Link className="more" href={`/${entry.coffee.slug}`}>
                      Tasting notes
                    </Link>
                  </div>
                </div>
              </li>
            ) : (
              <li key={entry.place.slug} className="pick">
                <Link href={`/places/${entry.place.slug}`} className="pick-art" tabIndex={-1} aria-hidden="true">
                  <Stamp place={entry.place} size={140} />
                </Link>
                <div className="pick-body">
                  <h3>
                    <Link href={`/places/${entry.place.slug}`}>{entry.place.name}</Link>
                  </h3>
                  <p className="pick-sub">{placeWhere(entry.place)}</p>
                  {(entry.note ?? entry.place.note) && <p className="pick-note">{entry.note ?? entry.place.note}</p>}
                  <div className="pick-meta">
                    <Cups rating={entry.place.rating} size={17} />
                    <a className="more" href={mapsLink(entry.place.name, placeWhere(entry.place), entry.place.mapUrl)} target="_blank" rel="noreferrer">
                      Map
                    </a>
                    <Link className="more" href={`/places/${entry.place.slug}`}>
                      The full page
                    </Link>
                  </div>
                </div>
              </li>
            ),
          )}
        </ol>

        <Comments pageKey={`guide:${guide.slug}`} title={`a pick from “${guide.title}”`} />
        <div style={{ height: "3rem" }} />
      </div>
    </article>
  );
}
