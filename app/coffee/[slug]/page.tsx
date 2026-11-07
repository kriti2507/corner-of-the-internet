import { permanentRedirect } from "next/navigation";
import { getPlace, getPlaces } from "@/content/places";

/** The old placeholder café slugs, so links to them still land on /places. */
const OLD_SLUGS = ["example-counter", "example-order", "example-trail"];

export function generateStaticParams() {
  return [...OLD_SLUGS, ...getPlaces().map((place) => place.slug)].map((slug) => ({ slug }));
}

/** Old café links go to the matching place, or to /places. */
export default async function CafePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(getPlace(slug) ? `/places/${slug}` : "/places");
}
