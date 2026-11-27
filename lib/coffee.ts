import "server-only";

import { cacheLife, cacheTag } from "next/cache";

/**
 * The Coffee Notebook is its own app (the coffee/ folder, its own Vercel
 * project). heykriti.com/coffee/* is rewritten to it in next.config.ts.
 * This reads its public feed so the home page and /weekends can show it.
 */
export const COFFEE_ORIGIN = process.env.COFFEE_ORIGIN ?? "https://kriti-coffee.vercel.app";

export type CoffeeFeed = {
  stats: { coffees: number; places: number; shops: number; regions: number };
  coffees: { slug: string; name: string; brand?: string; kind: string; rating?: number; price?: number; summary?: string; url: string; sample: boolean }[];
  guides: { slug: string; title: string; summary?: string; count: number; url: string; sample: boolean }[];
};

export async function getCoffeeFeed(): Promise<CoffeeFeed | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("coffee");
  try {
    const response = await fetch(`${COFFEE_ORIGIN}/coffee/api/feed`, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return null;
    return (await response.json()) as CoffeeFeed;
  } catch {
    return null;
  }
}

/** Links into the coffee zone are plain <a> tags: it's a different app. */
export const coffeeHref = (path = "") => `/coffee${path}`;
