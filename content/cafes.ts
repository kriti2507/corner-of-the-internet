/**
 * Cafés now live in content/places.ts with matcha, onsen, gardens and trips.
 * These names stay so a note's `cafes: [slug]` frontmatter still resolves.
 * Any place slug works there, not only cafés.
 */
import { getPlace, getPlaces, type Place } from "@/content/places";

export type Cafe = Place;

export const getCafes = getPlaces;
export const getCafe = getPlace;
