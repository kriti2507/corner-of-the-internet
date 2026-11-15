/**
 * City and region guides. Each guide is a hub page at /guides/<slug> that builds
 * itself from posts, so adding a post never means editing a page.
 *
 * To put a post in a guide, add two lines to its frontmatter:
 *
 *   guide: sapporo
 *   section: months
 *
 * Optional `part: 2` sets the order inside a section (months use 1–12; an overview uses 0).
 * Posts without a part come after, oldest first.
 *
 * To start a new guide (Tokyo, say), add an entry below with its sections.
 */

export type GuideSection = {
  id: string;
  title: string;
  intro: string;
};

export type Guide = {
  slug: string;
  title: string;
  /** Short name used in links, e.g. "Sapporo". */
  short: string;
  intro: string;
  sections: GuideSection[];
};

export const guides: Guide[] = [
  {
    slug: "sapporo",
    title: "Sapporo & Hokkaido",
    short: "Sapporo & Hokkaido",
    intro:
      "I lived in Sapporo before moving to Tokyo in 2026. This is everything I'd tell a friend: when to come, where to drink coffee and soak, and where to go once you leave the city.",
    sections: [
      {
        id: "months",
        title: "When to go",
        intro: "What Sapporo is like in each month, from the Snow Festival to the beer gardens and the autumn leaves.",
      },
      {
        id: "sapporo",
        title: "In Sapporo",
        intro: "Coffee, matcha, onsen and getting outside, from places I actually went to.",
      },
      {
        id: "hokkaido",
        title: "Around Hokkaido",
        intro: "Where to go beyond the city, area by area, with the places I've been.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}
