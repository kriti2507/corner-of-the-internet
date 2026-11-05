/**
 * Café records. The three entries below are placeholders from the original
 * site — not real shops and not reviews. Replace the name, neighbourhood,
 * note, and tags when you have a real counter.
 *
 * Tags you might use later: pour-over, roaster, work-friendly, dessert.
 * Keep `placeholder: true` until the card is real, and drop the `example` tag.
 *
 * `nameJa` is the neighbourhood in Japanese, for example 下北沢.
 * Leave it "" until that neighbourhood is a real place already in this file.
 */

export type Cafe = {
  slug: string;
  name: string;
  neighbourhood: string;
  /** Japanese neighbourhood. Empty until the English area is a real place. */
  nameJa: string;
  city: string;
  tags: string[];
  note: string;
  placeholder: boolean;
  photo: string | null;
  mapUrl: string | null;
};

export const cafes: Cafe[] = [
  {
    slug: "example-counter",
    name: "[café name]",
    neighbourhood: "[neighborhood, Tokyo]",
    nameJa: "",
    city: "Tokyo",
    tags: ["example"],
    note: "Placeholder. Not a real café yet.",
    placeholder: true,
    photo: null,
    mapUrl: null,
  },
  {
    slug: "example-order",
    name: "[café name]",
    neighbourhood: "[neighborhood, Tokyo]",
    nameJa: "",
    city: "Tokyo",
    tags: ["example"],
    note: "Placeholder. A real order and a real note will land here.",
    placeholder: true,
    photo: null,
    mapUrl: null,
  },
  {
    slug: "example-trail",
    name: "[café name]",
    neighbourhood: "[on the way to a trail]",
    nameJa: "",
    city: "Tokyo",
    tags: ["example"],
    note: "Placeholder. Nothing here is a recommendation yet.",
    placeholder: true,
    photo: null,
    mapUrl: null,
  },
];

export function getCafes() {
  return cafes;
}

export function getCafe(slug: string) {
  return cafes.find((cafe) => cafe.slug === slug) ?? null;
}
