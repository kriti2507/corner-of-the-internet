import Link from "next/link";
import { notFound } from "next/navigation";
import "@/app/weekends.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NoteList, TagLinks } from "@/components/notes";
import { getPlace, getPlaces, kindLabel, placeWhere } from "@/content/places";
import { weekends } from "@/content/weekends";
import { postsMentioning } from "@/lib/journal";

export function generateStaticParams() {
  return getPlaces().map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return {};
  const description = `${kindLabel(place.kind)} in ${placeWhere(place)}. ${place.note}`;
  return {
    title: `${place.name}, ${placeWhere(place)}`,
    description,
    alternates: { canonical: `/places/${place.slug}` },
  };
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();
  const notes = postsMentioning("cafes", place.slug);

  const all = getPlaces();
  const sameKind = all.filter((item) => item.kind === place.kind);
  const index = sameKind.findIndex((item) => item.slug === place.slug);
  const prev = sameKind[index - 1];
  const next = sameKind[index + 1];
  const nearby = all.filter((item) => item.region === place.region && item.slug !== place.slug).slice(0, 4);

  return (
    <section className="band wk-scope" data-lane="places" aria-labelledby="place-heading">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: weekends.title, href: "/weekends" },
            { label: weekends.lanes.places.label, href: "/places" },
            { label: place.name },
          ]}
        />
        <div className="wk-detail">
          <div className="wk-detail-main">
            <p className="script kicker">{kindLabel(place.kind).toLowerCase()}</p>
            <h1 id="place-heading">{place.name}</h1>
            <p className="lede" style={{ margin: 0 }}>
              {placeWhere(place)}
            </p>
            <div className="wk-card wk-detail-note">
              {place.myNote ? (
                <>
                  <p className="wk-latest-label">My note</p>
                  <p className="wk-quote" style={{ margin: 0 }}>
                    {place.note}
                  </p>
                </>
              ) : (
                <p style={{ margin: 0 }}>{place.note}</p>
              )}
            </div>
            <TagLinks tags={place.tags} />
            <p style={{ margin: 0 }}>
              <a className="wk-link" href={place.mapUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps ↗
              </a>
            </p>
            {notes.length > 0 ? (
              <>
                <h2 className="subhead">Notes</h2>
                <NoteList notes={notes} empty="" />
              </>
            ) : null}
            <nav className="wk-pager" aria-label={`More ${kindLabel(place.kind).toLowerCase()} places`}>
              {prev ? (
                <Link href={`/places/${prev.slug}`}>
                  <small>← Previous</small>
                  <span>{prev.name}</span>
                </Link>
              ) : null}
              {next ? (
                <Link href={`/places/${next.slug}`}>
                  <small>Next →</small>
                  <span>{next.name}</span>
                </Link>
              ) : null}
            </nav>
          </div>

          <aside className="wk-card" aria-labelledby="nearby-heading" style={{ padding: "1rem 1.1rem" }}>
            <p className="wk-latest-label" id="nearby-heading">
              Also in {place.region}
            </p>
            <ul className="wk-rows" style={{ marginTop: "0.5rem" }}>
              {nearby.map((item) => (
                <li key={item.slug}>
                  <Link className="wk-row" href={`/places/${item.slug}`}>
                    <span className="wk-row-title">{item.name}</span>
                    <span className="wk-row-meta">{kindLabel(item.kind)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p style={{ margin: "0.8rem 0 0" }}>
              <Link className="wk-link" href="/places">
                All the places →
              </Link>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
