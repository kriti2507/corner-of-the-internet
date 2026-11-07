import type { Metadata } from "next";
import "@/app/weekends.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PlacesBrowser } from "@/components/weekends/places-browser";
import { getPlaces } from "@/content/places";
import { site } from "@/content/site";
import { weekends } from "@/content/weekends";

const description =
  "Cafés, matcha, onsen, gardens and trips around Japan that Kriti has been to, from Tokyo and Sapporo to Kumejima, with her own notes.";

export const metadata: Metadata = {
  title: "Places",
  description,
  alternates: { canonical: "/places" },
  openGraph: { title: `Places · ${site.name}`, description, url: "/places", siteName: site.name, type: "website", locale: "en_US" },
};

export default function PlacesPage() {
  const places = getPlaces();
  const regions = new Set(places.map((place) => place.region)).size;

  return (
    <section className="band wk-scope" data-lane="places" aria-labelledby="places-heading">
      <div className="wrap">
        <Breadcrumbs items={[{ label: weekends.title, href: "/weekends" }, { label: weekends.lanes.places.label }]} />
        <div className="wk-head">
          <p className="script kicker">around Japan</p>
          <h1 id="places-heading">Places</h1>
          <p className="lede">
            {places.length} places across {regions} regions, all places I&apos;ve been to. Anything in quotes
            is my own note from Google Maps.
          </p>
        </div>
        <PlacesBrowser places={places} />
      </div>
    </section>
  );
}
