import { permanentRedirect } from "next/navigation";
import { getPlace } from "@/content/places";

/** Old café links go to the matching place, or to /places. */
export default async function CafePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(getPlace(slug) ? `/places/${slug}` : "/places");
}
