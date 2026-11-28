import hikesJson from "@/data/hikes.json";
import { seasonFor, slugify } from "@/lib/slug";

/** What I want to remember about a hike. Every part is optional. */
export type HikeNotes = {
  /** How I got there and back: trains, buses, car park, trailhead. */
  access?: string;
  /** What the trail is like: terrain, views, crowds, hard parts. */
  trail?: string;
  /** How it felt. */
  feeling?: string;
};

export type Hike = {
  slug: string;
  /** Entry id in Small Wins (topic "hikes"), so a sync never adds a hike twice. */
  smallWinsId: number | null;
  title: string;
  region: string;
  date: string;
  heightM: number;
  climbedM: number;
  durationMin: number | null;
  lat: number | null;
  lng: number | null;
  pinApproximate: boolean;
  /** Path under public/, e.g. /photos/hikes/jinbasan.webp. Null draws a sketch. */
  photo: string | null;
  photoAlt: string;
  notes: HikeNotes;
  /** Days on the mountain. 1 unless it was a multi-day trip. */
  days: number;
  /** Huts I slept in, in order, for multi-day hikes. */
  huts: string[];
  /** Region, plus the season of the logged date. Difficulty is not in the log. */
  tags: string[];
};

type RawHike = {
  smallWinsId?: number;
  title: string;
  region: string;
  date: string;
  height_of_mountain_m: number;
  climbed_m: number;
  duration_min: number | null;
  lat?: number;
  lng?: number;
  pinApproximate?: boolean;
  photo?: string;
  photoAlt?: string;
  notes?: HikeNotes;
  days?: number;
  huts?: string[];
};

/**
 * The hike log lives in data/hikes.json, one line per hike, oldest first.
 * New hikes come from Small Wins (topic "hikes"); see README "Adding a hike".
 */
export function getHikes(): Hike[] {
  return (hikesJson as RawHike[])
    .map((hike) => ({
      slug: slugify(hike.title),
      smallWinsId: hike.smallWinsId ?? null,
      title: hike.title,
      region: hike.region,
      date: hike.date,
      heightM: hike.height_of_mountain_m,
      climbedM: hike.climbed_m,
      durationMin: hike.duration_min,
      lat: hike.lat ?? null,
      lng: hike.lng ?? null,
      pinApproximate: Boolean(hike.pinApproximate),
      photo: hike.photo ?? null,
      photoAlt: hike.photoAlt ?? `${hike.title}, ${hike.region}`,
      notes: hike.notes ?? {},
      days: hike.days ?? 1,
      huts: hike.huts ?? [],
      tags: [slugify(hike.region), seasonFor(hike.date)],
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getHike(slug: string) {
  return getHikes().find((hike) => hike.slug === slug) ?? null;
}

export function hasNotes(hike: Hike) {
  return Boolean(hike.notes.access || hike.notes.trail || hike.notes.feeling || hike.huts.length);
}
