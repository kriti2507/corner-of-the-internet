import type { Metadata } from "next";
import Link from "next/link";
import "@/app/weekends.css";
import "@/app/scrapbook.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PlacesBrowser } from "@/components/weekends/places-browser";
import { getPlace, getPlaces, PLACE_KINDS, placeWhere } from "@/content/places";
import { site } from "@/content/site";
import { weekends } from "@/content/weekends";

const description =
  "Onsen, gardens and trips around Japan that Kriti has been to, from Tokyo and Hokkaido to Okinawa, with her own notes.";

export const metadata: Metadata = {
  title: "Places",
  description,
  alternates: { canonical: "/places" },
  openGraph: { title: `Places · ${site.name}`, description, url: "/places", siteName: site.name, type: "website", locale: "en_US" },
};

const MARK: Record<string, string> = { onsen: "mark-red", park: "mark-green", trip: "mark-blue" };

export default function PlacesPage() {
  const places = getPlaces();
  const regions = new Set(places.map((place) => place.region)).size;
  const kinds = PLACE_KINDS.map((kind) => ({ ...kind, count: places.filter((place) => place.kind === kind.id).length })).filter(
    (kind) => kind.count > 0,
  );
  const noted = places.filter((place) => place.myNote);
  const first = getPlace(weekends.featuredPlace) ?? noted[0] ?? places[0];
  const second = noted.find((place) => place.slug !== first.slug && place.region !== first.region) ?? noted.find((place) => place.slug !== first.slug);
  const covers = [first, second].filter((place) => place !== undefined);

  return (
    <div className="sb-scope wk-scope" data-lane="places">
      <section className="sb-hero-band" aria-labelledby="places-heading">
        <div className="wrap sb-hero">
          <div className="sb-hero-text">
            <Breadcrumbs items={[{ label: weekends.title, href: "/weekends" }, { label: weekends.lanes.places.label }]} />
            <p className="script sb-hello">postcards from around Japan ↓</p>
            <h1 id="places-heading" className="sb-title">
              Places
            </h1>
            <p className="sb-lead">
              {places.length} places I&apos;ve been to across {regions} regions:{" "}
              {kinds.map((kind, index) => (
                <span key={kind.id}>
                  <mark className={`mark ${MARK[kind.id] ?? "mark-yellow"}`}>
                    {kind.count} {kind.count === 1 ? kind.label.toLowerCase() : kind.plural.toLowerCase()}
                  </mark>
                  {index < kinds.length - 2 ? ", " : index === kinds.length - 2 ? " and " : "."}
                </span>
              ))}
            </p>
            <p className="sb-sublead">
              Anything in quotes is my own note from Google Maps. Cafés and matcha live in{" "}
              <a href="/coffee/places">the Coffee Notebook</a>.
            </p>
          </div>
          <div className="sb-hero-photos sb-hero-cards">
            {covers.map((place, index) => (
              <Link
                key={place.slug}
                href={`/places/${place.slug}`}
                className={`sb-postcard sb-hero-postcard ${index === 0 ? "sb-hero-a" : "sb-hero-b"}`}
                data-kind={place.kind}
              >
                <span className={`sb-tape ${index === 0 ? "sb-tape-yellow" : "sb-tape-green"}`} aria-hidden="true" />
                <span className="sb-stamp" aria-hidden="true">
                  {place.kind === "onsen" ? "湯" : place.kind === "park" ? "庭" : "旅"}
                </span>
                <span className="sb-postcard-kind">{placeWhere(place)}</span>
                <span className="sb-hero-postcard-name">{place.name}</span>
                <span className="sb-hero-postcard-note">“{place.note}”</span>
              </Link>
            ))}
            <svg className="sb-spark" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill="#1c2744" />
            </svg>
          </div>
        </div>
      </section>

      <section className="sb-band sb-band-peach" aria-labelledby="map-heading">
        <div className="wrap">
          <div className="sb-section-head">
            <p className="script kicker">the map</p>
            <h2 id="map-heading">Where I&apos;ve been</h2>
          </div>
          <PlacesBrowser places={places} />
        </div>
      </section>
    </div>
  );
}
