import type { MetadataRoute } from "next";
import { SITE, getCoffees, getGuides, getPlaces, getSections } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const real = <T extends { sample: boolean }>(item: T) => !item.sample;
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/shelf` },
    { url: `${SITE.url}/places` },
    { url: `${SITE.url}/guides` },
    ...getCoffees().filter(real).map((c) => ({ url: `${SITE.url}/${c.slug}`, lastModified: c.date })),
    ...getPlaces().filter(real).map((p) => ({ url: `${SITE.url}/places/${p.slug}` })),
    ...getGuides().filter(real).map((g) => ({ url: `${SITE.url}/guides/${g.slug}`, lastModified: g.date })),
    ...getSections().map((s) => ({ url: `${SITE.url}/sections/${s.slug}` })),
  ];
}
