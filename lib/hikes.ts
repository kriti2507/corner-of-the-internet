import hikesJson from "@/data/hikes.json";
import { site } from "@/content/site";
import { seasonFor, slugify } from "@/lib/slug";

export type Hike = {
  slug: string;
  title: string;
  region: string;
  date: string;
  heightM: number;
  climbedM: number;
  durationMin: number | null;
  lat: number | null;
  lng: number | null;
  pinApproximate: boolean;
  /** Region, plus the season of the logged date. Difficulty is not in the log. */
  tags: string[];
};

type RawHike = {
  title: string;
  region: string;
  date: string;
  height_of_mountain_m: number;
  climbed_m: number;
  duration_min: number | null;
};

/**
 * Bundled hike log.
 *
 * To go live, replace this function with a fetch of the Small Wins API
 * (topic "hikes"). Map its fields onto Hike:
 *   title -> title
 *   height_of_mountain -> heightM
 *   actual_height_hiked -> climbedM
 *   duration -> durationMin (confirm the unit; the API field type is "pace")
 * Coordinates are not in the log. Keep matching titles to site.hikePins.
 */
export function getHikes(): Hike[] {
  return (hikesJson as RawHike[])
    .map((hike) => {
      const pin = site.hikePins[hike.title];
      return {
        slug: slugify(hike.title),
        title: hike.title,
        region: hike.region,
        date: hike.date,
        heightM: hike.height_of_mountain_m,
        climbedM: hike.climbed_m,
        durationMin: hike.duration_min,
        lat: pin?.lat ?? null,
        lng: pin?.lng ?? null,
        pinApproximate: Boolean(pin?.approximate),
        tags: [slugify(hike.region), seasonFor(hike.date)],
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getHike(slug: string) {
  return getHikes().find((hike) => hike.slug === slug) ?? null;
}
