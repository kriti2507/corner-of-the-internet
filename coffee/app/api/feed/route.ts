import { COFFEE_KINDS, SITE, getCoffees, getGuides, getPlace, getPlaces, placeWhere, stats } from "@/lib/content";

export const dynamic = "force-static";

/**
 * A small public feed so heykriti.com (or anything else) can show the latest
 * coffees and guides without copying them. Links point at heykriti.com/coffee.
 */
export function GET() {
  const coffees = getCoffees().map((coffee) => ({
    slug: coffee.slug,
    name: coffee.name,
    nameJa: coffee.nameJa,
    brand: coffee.brand,
    kind: COFFEE_KINDS[coffee.kind].label,
    rating: coffee.rating,
    price: coffee.price,
    date: coffee.date,
    summary: coffee.summary,
    boughtAt: coffee.boughtAt ? getPlace(coffee.boughtAt)?.name : undefined,
    photo: coffee.photos[0]?.src ? new URL(coffee.photos[0].src, SITE.home).toString() : undefined,
    sample: coffee.sample,
    url: `${SITE.url}/${coffee.slug}`,
  }));
  const guides = getGuides().map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    summary: guide.summary,
    count: guide.items.length,
    date: guide.date,
    sample: guide.sample,
    url: `${SITE.url}/guides/${guide.slug}`,
  }));
  const places = getPlaces().map((place) => ({
    slug: place.slug,
    name: place.name,
    kind: place.kind,
    where: placeWhere(place),
    rating: place.rating,
    url: `${SITE.url}/places/${place.slug}`,
  }));
  return Response.json(
    { name: SITE.name, url: SITE.url, stats: stats(), coffees, guides, places },
    { headers: { "access-control-allow-origin": "*" } },
  );
}
