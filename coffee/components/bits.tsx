import Link from "next/link";
import type { Coffee, Place, Guide, Section } from "@/lib/content";
import { COFFEE_KINDS, PLACE_KINDS, getPlace, placeWhere, sectionItems } from "@/lib/content";
import { yen } from "@/lib/format";
import { Cups, LetterBoard, Packet, Stamp } from "./art";

/** A coffee on the shelf: its first photo if there is one, else its packet. */
export function PacketLink({ coffee, tag = true }: { coffee: Coffee; tag?: boolean }) {
  const photo = coffee.photos[0];
  return (
    <Link href={`/${coffee.slug}`} className="packet-link" aria-label={`${coffee.name}${coffee.brand ? `, ${coffee.brand}` : ""}`}>
      {tag && (
        <span className="packet-tag" aria-hidden="true">
          {coffee.rating !== undefined ? `${coffee.rating} / 5` : COFFEE_KINDS[coffee.kind].label}
        </span>
      )}
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="packet-photo" src={photo.src} alt="" loading="lazy" />
      ) : (
        <Packet coffee={coffee} />
      )}
    </Link>
  );
}

export function CoffeeCaption({ coffee }: { coffee: Coffee }) {
  const where = coffee.boughtAt ? getPlace(coffee.boughtAt)?.name : undefined;
  const bits = [COFFEE_KINDS[coffee.kind].label, where && where !== coffee.brand ? where : coffee.brand, yen(coffee.price)].filter(Boolean);
  return (
    <div className="item-cap">
      <strong>
        <Link href={`/${coffee.slug}`} style={{ textDecoration: "none" }}>
          {coffee.name}
        </Link>
      </strong>
      <span>{bits.join(", ")}</span>
      <Cups rating={coffee.rating} size={15} />
    </div>
  );
}

export function StampLink({ place }: { place: Place }) {
  return (
    <Link href={`/places/${place.slug}`}>
      <Stamp place={place} />
      <span className="stamp-name">{place.name}</span>
      <span className="stamp-where">
        {PLACE_KINDS[place.kind].label} in {placeWhere(place)}
      </span>
    </Link>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link href={`/guides/${guide.slug}`} className="board-card">
      <LetterBoard guide={guide} />
      <div className="board-meta">
        <h3>{guide.title}</h3>
        {guide.summary && <p>{guide.summary}</p>}
      </div>
    </Link>
  );
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        <li>
          <Link href="/">Notebook</Link>
        </li>
        {items.map((item) => (
          <li key={item.label}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function SampleNote({ what }: { what: string }) {
  return (
    <p className="sample-note" role="note">
      Sample {what}: placeholder words and ratings, not a real review yet
    </p>
  );
}

export function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/**
 * A Google Maps embed. Uses coordinates when the place has them, else a search
 * for its name, so it works without an API key.
 */
export function MapEmbed({ name, area, lat, lng, href }: { name: string; area?: string; lat?: number; lng?: number; href: string }) {
  const q = encodeURIComponent([name, area].filter(Boolean).join(" "));
  const src =
    lat !== undefined && lng !== undefined
      ? `https://maps.google.com/maps?q=${q}&ll=${lat},${lng}&z=15&output=embed`
      : `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  return (
    <figure className="map-frame">
      <iframe src={src} title={`Map of ${name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      <figcaption className="map-frame-bar">
        <span>{[name, area].filter(Boolean).join(", ")}</span>
        <a className="more" href={href} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      </figcaption>
    </figure>
  );
}

export function Gallery({ photos }: { photos: { src: string; alt: string; caption?: string }[] }) {
  const [first, ...rest] = photos;
  return (
    <div className="gallery">
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={first.src} alt={first.alt} />
        {first.caption && <figcaption>{first.caption}</figcaption>}
      </figure>
      {rest.length > 0 && (
        <div className="gallery-thumbs">
          {rest.map((photo) => (
            <figure key={photo.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <a href={photo.src} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </a>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * A section as a block: its heading, then the places and coffees that match its
 * rule. `limit` keeps the home page short; the section's own page shows all.
 */
export function SectionBlock({ section, limit, heading = "h2" }: { section: Section; limit?: number; heading?: "h1" | "h2" }) {
  const { coffees, places } = sectionItems(section);
  const shownCoffees = limit ? coffees.slice(0, limit) : coffees;
  const shownPlaces = limit ? places.slice(0, limit) : places;
  const total = coffees.length + places.length;
  const hidden = total - shownCoffees.length - shownPlaces.length;
  const id = `section-${section.slug}`;
  const Heading = heading;
  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby={id}>
      <div className={heading === "h1" ? undefined : "wrap"}>
        <div className="section-head">
          <div>
            {section.titleJa && (
              <span className="ja-tag" lang="ja">
                {section.titleJa}
              </span>
            )}
            <Heading id={id}>{section.title}</Heading>
            {section.summary && <p>{section.summary}</p>}
          </div>
          {limit !== undefined && (
            <Link className="more" href={`/sections/${section.slug}`}>
              {hidden > 0 ? `All ${total}` : "Open the section"}
            </Link>
          )}
        </div>
        {heading === "h1" && section.html && <div className="prose" style={{ marginBottom: "2rem" }} dangerouslySetInnerHTML={{ __html: section.html }} />}
        {total === 0 && <p style={{ color: "var(--muted)" }}>Nothing here yet.</p>}
        {shownPlaces.length > 0 && (
          <ul className="stamps" style={{ marginBottom: shownCoffees.length ? "2.2rem" : 0 }}>
            {shownPlaces.map((place) => (
              <li key={place.slug}>
                <StampLink place={place} />
              </li>
            ))}
          </ul>
        )}
        {shownCoffees.length > 0 && (
          <ul className="shelf-grid">
            {shownCoffees.map((coffee) => (
              <li key={coffee.slug}>
                <PacketLink coffee={coffee} tag={false} />
                <CoffeeCaption coffee={coffee} />
                {coffee.season && <span className="item-season">{coffee.season}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/** Small links to the sections an entry is in. */
export function SectionChips({ sections }: { sections: Section[] }) {
  if (sections.length === 0) return null;
  return (
    <>
      {sections.map((section) => (
        <Link key={section.slug} className="chip" href={`/sections/${section.slug}`} style={{ alignSelf: "center" }}>
          {section.title}
        </Link>
      ))}
    </>
  );
}
