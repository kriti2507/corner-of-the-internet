import "server-only";
import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { renderMarkdown } from "./markdown";

/**
 * Everything on the site comes from Markdown files in content/:
 *
 *   content/coffees/<slug>.md  → /coffee/<slug>
 *   content/places/<slug>.md   → /coffee/places/<slug>
 *   content/guides/<slug>.md   → /coffee/guides/<slug>
 *   content/sections/<slug>.md → /coffee/sections/<slug>, plus a block on the home page
 *
 * The filename is the URL. Frontmatter holds the facts, the body is the write-up.
 * Pages link to each other by slug, so nothing is hard-coded in a page.
 */

export const SITE = {
  name: "The Coffee Notebook",
  nameJa: "珈琲帳",
  owner: "Kriti Agarwal",
  /** Canonical home. heykriti.com/coffee rewrites to this app. */
  url: "https://heykriti.com/coffee",
  home: "https://heykriti.com",
  description:
    "Every coffee Kriti buys in Japan: drip bags from Kaldi, konbini cans, beans, and the cafés in Tokyo and Sapporo worth the train ride. With photos, maps and honest ratings.",
};

export type CoffeeKind = "drip-bag" | "beans" | "ground" | "cafe-drink" | "canned" | "instant" | "konbini";
export type Roast = "light" | "medium-light" | "medium" | "medium-dark" | "dark";
export type Again = "yes" | "maybe" | "no";
export type PlaceKind = "cafe" | "matcha" | "shop" | "roaster";

export type Photo = { src: string; alt: string; caption?: string };

export type Taste = { acidity?: number; body?: number; sweetness?: number; bitterness?: number; aroma?: number };

export type Coffee = {
  type: "coffee";
  slug: string;
  name: string;
  nameJa?: string;
  brand?: string;
  kind: CoffeeKind;
  boughtAt?: string;
  price?: number;
  priceNote?: string;
  date?: string;
  rating?: number;
  origin: string[];
  roast?: Roast;
  process?: string;
  notes: string[];
  taste?: Taste;
  brew?: { method?: string; dose?: string; water?: string; time?: string };
  again?: Again;
  summary?: string;
  tags: string[];
  photos: Photo[];
  mapUrl?: string;
  /** Set for limited-time drinks, e.g. "Holiday 2026". Puts it in any seasonal section. */
  season?: string;
  sample: boolean;
  draft: boolean;
  html: string;
};

export type Place = {
  type: "place";
  slug: string;
  name: string;
  nameJa?: string;
  kind: PlaceKind;
  /** The chain, for branches of one, e.g. "Starbucks". */
  brand?: string;
  area: string;
  region: string;
  address?: string;
  note?: string;
  myNote: boolean;
  tags: string[];
  lat?: number;
  lng?: number;
  mapUrl?: string;
  rating?: number;
  visited?: string;
  photos: Photo[];
  sample: boolean;
  draft: boolean;
  html: string;
};

export type GuideItem = { coffee?: string; place?: string; note?: string };

export type Guide = {
  type: "guide";
  slug: string;
  title: string;
  kicker?: string;
  summary?: string;
  date?: string;
  place?: string;
  cover: string;
  items: GuideItem[];
  tags: string[];
  sample: boolean;
  draft: boolean;
  html: string;
};

/**
 * A section is a shelf that fills itself: it lists every coffee and place that
 * matches its rule, so a new entry shows up in it without touching the section.
 * Every key given in `match` has to match (brand, tag), and `seasonal: true`
 * takes coffees that have a `season`. Places only match on brand and tag.
 */
export type SectionMatch = { brand?: string; tag?: string; seasonal?: boolean; kind?: CoffeeKind };

export type Section = {
  type: "section";
  slug: string;
  title: string;
  titleJa?: string;
  summary?: string;
  order: number;
  match: SectionMatch;
  draft: boolean;
  html: string;
};

export const COFFEE_KINDS: Record<CoffeeKind, { label: string; plural: string; ja: string }> = {
  "drip-bag": { label: "Drip bag", plural: "Drip bags", ja: "ドリップ" },
  beans: { label: "Beans", plural: "Beans", ja: "豆" },
  ground: { label: "Ground", plural: "Ground coffee", ja: "粉" },
  "cafe-drink": { label: "Café cup", plural: "Café cups", ja: "店" },
  canned: { label: "Can & bottle", plural: "Cans & bottles", ja: "缶" },
  instant: { label: "Instant", plural: "Instant", ja: "即" },
  konbini: { label: "Konbini", plural: "Konbini coffee", ja: "コンビニ" },
};

export const PLACE_KINDS: Record<PlaceKind, { label: string; plural: string; ja: string }> = {
  cafe: { label: "Café", plural: "Cafés", ja: "喫茶" },
  matcha: { label: "Matcha & tea", plural: "Matcha & tea", ja: "抹茶" },
  shop: { label: "Shop", plural: "Shops", ja: "店" },
  roaster: { label: "Roaster", plural: "Roasters", ja: "焙煎" },
};

export const ROASTS: Roast[] = ["light", "medium-light", "medium", "medium-dark", "dark"];

const ROOT = path.join(process.cwd(), "content");

type Raw = { slug: string; data: Record<string, unknown>; body: string };

function readDir(dir: string): Raw[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = fs.readFileSync(path.join(full, file), "utf8").replace(/\r\n/g, "\n");
      const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      const data = match ? ((parseYaml(match[1]) as Record<string, unknown>) ?? {}) : {};
      return { slug: file.replace(/\.md$/, ""), data, body: match ? match[2] : source };
    });
}

const str = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);
const num = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : undefined);
const list = (value: unknown) =>
  Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : typeof value === "string" ? [value] : [];
const day = (value: unknown) =>
  value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === "string" ? value.slice(0, 10) : undefined;

/** Photos can be a filename in public/photos, a /coffee/... path, or a full URL. */
function photos(value: unknown, fallbackAlt: string): Photo[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? { src: item } : (item as Record<string, unknown>)))
    .filter((item) => item && typeof item.src === "string")
    .map((item) => {
      const src = String(item.src);
      return {
        src: /^https?:\/\//.test(src) || src.startsWith("/") ? src : `/coffee/photos/${src}`,
        alt: str(item.alt) ?? fallbackAlt,
        caption: str(item.caption),
      };
    });
}

const showDrafts = process.env.NODE_ENV !== "production";

function coffeeFrom({ slug, data, body }: Raw): Coffee {
  const name = str(data.name) ?? slug;
  const kind = (str(data.kind) as CoffeeKind) ?? "drip-bag";
  const taste = data.taste && typeof data.taste === "object" ? (data.taste as Taste) : undefined;
  return {
    type: "coffee",
    slug,
    name,
    nameJa: str(data.nameJa),
    brand: str(data.brand),
    kind: kind in COFFEE_KINDS ? kind : "drip-bag",
    boughtAt: str(data.boughtAt),
    price: num(data.price),
    priceNote: str(data.priceNote),
    date: day(data.date),
    rating: num(data.rating),
    origin: list(data.origin),
    roast: str(data.roast) as Roast | undefined,
    process: str(data.process),
    notes: list(data.notes),
    taste,
    brew: data.brew && typeof data.brew === "object" ? (data.brew as Coffee["brew"]) : undefined,
    again: (str(data.again) ?? (data.again === true ? "yes" : data.again === false ? "no" : undefined)) as Again | undefined,
    summary: str(data.summary),
    tags: list(data.tags),
    photos: photos(data.photos, name),
    mapUrl: str(data.mapUrl),
    season: str(data.season),
    sample: data.sample === true,
    draft: data.draft === true,
    html: renderMarkdown(body),
  };
}

function placeFrom({ slug, data, body }: Raw): Place {
  const name = str(data.name) ?? slug;
  const kind = (str(data.kind) as PlaceKind) ?? "cafe";
  return {
    type: "place",
    slug,
    name,
    nameJa: str(data.nameJa),
    kind: kind in PLACE_KINDS ? kind : "cafe",
    brand: str(data.brand),
    area: str(data.area) ?? "",
    region: str(data.region) ?? "",
    address: str(data.address),
    note: str(data.note),
    myNote: data.myNote !== false,
    tags: list(data.tags),
    lat: num(data.lat),
    lng: num(data.lng),
    mapUrl: str(data.mapUrl),
    rating: num(data.rating),
    visited: day(data.visited),
    photos: photos(data.photos, name),
    sample: data.sample === true,
    draft: data.draft === true,
    html: renderMarkdown(body),
  };
}

function guideFrom({ slug, data, body }: Raw): Guide {
  const items = Array.isArray(data.items)
    ? (data.items as unknown[])
        .map((item) =>
          typeof item === "string"
            ? { coffee: item }
            : { coffee: str((item as GuideItem).coffee), place: str((item as GuideItem).place), note: str((item as GuideItem).note) },
        )
        .filter((item) => item.coffee || item.place)
    : [];
  return {
    type: "guide",
    slug,
    title: str(data.title) ?? slug,
    kicker: str(data.kicker),
    summary: str(data.summary),
    date: day(data.date),
    place: str(data.place),
    cover: str(data.cover) ?? "kraft",
    items,
    tags: list(data.tags),
    sample: data.sample === true,
    draft: data.draft === true,
    html: renderMarkdown(body),
  };
}

function sectionFrom({ slug, data, body }: Raw): Section {
  const raw = data.match && typeof data.match === "object" ? (data.match as Record<string, unknown>) : {};
  const kind = str(raw.kind) as CoffeeKind | undefined;
  return {
    type: "section",
    slug,
    title: str(data.title) ?? slug,
    titleJa: str(data.titleJa),
    summary: str(data.summary),
    order: num(data.order) ?? 100,
    match: {
      brand: str(raw.brand),
      tag: str(raw.tag),
      seasonal: raw.seasonal === true,
      kind: kind && kind in COFFEE_KINDS ? kind : undefined,
    },
    draft: data.draft === true,
    html: renderMarkdown(body),
  };
}

const byDateDesc = <T extends { date?: string; visited?: string }>(a: T, b: T) =>
  (b.date ?? b.visited ?? "").localeCompare(a.date ?? a.visited ?? "");

let cache: { coffees: Coffee[]; places: Place[]; guides: Guide[]; sections: Section[] } | null = null;

function load() {
  if (cache) return cache;
  const visible = <T extends { draft: boolean }>(item: T) => showDrafts || !item.draft;
  cache = {
    coffees: readDir("coffees").map(coffeeFrom).filter(visible).sort(byDateDesc),
    places: readDir("places")
      .map(placeFrom)
      .filter(visible)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name)),
    guides: readDir("guides").map(guideFrom).filter(visible).sort(byDateDesc),
    sections: readDir("sections")
      .map(sectionFrom)
      .filter(visible)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
  };
  return cache;
}

export const getCoffees = () => load().coffees;
export const getPlaces = () => load().places;
export const getGuides = () => load().guides;
export const getCoffee = (slug: string) => getCoffees().find((item) => item.slug === slug) ?? null;
export const getPlace = (slug: string) => getPlaces().find((item) => item.slug === slug) ?? null;
export const getGuide = (slug: string) => getGuides().find((item) => item.slug === slug) ?? null;
export const getSections = () => load().sections;
export const getSection = (slug: string) => getSections().find((item) => item.slug === slug) ?? null;

const same = (a?: string, b?: string) => !!a && !!b && a.toLowerCase() === b.toLowerCase();
const hasTag = (tags: string[], tag: string) => tags.some((t) => same(t, tag));

function coffeeMatches(coffee: Coffee, match: SectionMatch) {
  const rules = [
    match.brand !== undefined && same(coffee.brand, match.brand),
    match.tag !== undefined && hasTag(coffee.tags, match.tag),
    match.seasonal && !!coffee.season,
    match.kind !== undefined && coffee.kind === match.kind,
  ];
  const given = [match.brand !== undefined, match.tag !== undefined, !!match.seasonal, match.kind !== undefined];
  return given.some(Boolean) && given.every((isGiven, i) => !isGiven || rules[i]);
}

function placeMatches(place: Place, match: SectionMatch) {
  // A rule about seasons or drink kinds is about coffees, so places stay out.
  if (match.seasonal || match.kind) return false;
  if (match.brand === undefined && match.tag === undefined) return false;
  return (match.brand === undefined || same(place.brand, match.brand)) && (match.tag === undefined || hasTag(place.tags, match.tag));
}

/** Everything a section lists, newest coffees first. */
export function sectionItems(section: Section) {
  return {
    coffees: getCoffees().filter((coffee) => coffeeMatches(coffee, section.match)),
    places: getPlaces().filter((place) => placeMatches(place, section.match)),
  };
}

/** Sections a coffee or place shows up in. */
export function sectionsFor(item: Coffee | Place) {
  return getSections().filter((section) =>
    item.type === "coffee" ? coffeeMatches(item, section.match) : placeMatches(item, section.match),
  );
}

/** Coffees bought or drunk at a place. */
export const coffeesAt = (slug: string) => getCoffees().filter((coffee) => coffee.boughtAt === slug);

/** Guides that mention a coffee or a place. */
export function guidesMentioning(slug: string, kind: "coffee" | "place") {
  return getGuides().filter(
    (guide) => guide.place === slug || guide.items.some((item) => (kind === "coffee" ? item.coffee : item.place) === slug),
  );
}

export function placeWhere(place: Pick<Place, "area" | "region">) {
  if (!place.area || place.area === place.region) return place.region;
  if (!place.region) return place.area;
  return `${place.area}, ${place.region}`;
}

/** Google Maps link for anything: its own mapUrl, else a search for the name. */
export function mapsLink(name: string, area?: string, explicit?: string) {
  if (explicit) return explicit;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, area].filter(Boolean).join(" "))}`;
}

export function stats() {
  const coffees = getCoffees();
  const places = getPlaces();
  const rated = coffees.filter((coffee) => coffee.rating !== undefined);
  const spent = coffees.reduce((sum, coffee) => sum + (coffee.price ?? 0), 0);
  return {
    coffees: coffees.length,
    places: places.filter((place) => place.kind !== "shop").length,
    shops: places.filter((place) => place.kind === "shop").length,
    regions: new Set(places.map((place) => place.region).filter(Boolean)).size,
    spent,
    average: rated.length ? rated.reduce((sum, coffee) => sum + (coffee.rating ?? 0), 0) / rated.length : null,
  };
}

/** Every page that can carry comments, keyed the way the comments API stores them. */
export function commentKeys() {
  return [
    ...getCoffees().map((item) => `coffee:${item.slug}`),
    ...getPlaces().map((item) => `place:${item.slug}`),
    ...getGuides().map((item) => `guide:${item.slug}`),
  ];
}

export function titleForKey(key: string) {
  const [type, slug] = key.split(":");
  if (type === "coffee") return getCoffee(slug)?.name;
  if (type === "place") return getPlace(slug)?.name;
  if (type === "guide") return getGuide(slug)?.title;
  return undefined;
}

export function pathForKey(key: string) {
  const [type, slug] = key.split(":");
  if (type === "coffee") return `/${slug}`;
  if (type === "place") return `/places/${slug}`;
  if (type === "guide") return `/guides/${slug}`;
  return "/";
}
