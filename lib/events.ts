import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { site, type CalendarEvent } from "@/content/site";
import { parseIcs, pastEvents, upcomingEvents } from "@/lib/ics";

export async function getEvents(): Promise<{
  upcoming: CalendarEvent[];
  past: CalendarEvent[];
  source: "live" | "fallback";
}> {
  "use cache";
  cacheLife("hours");
  cacheTag("luma");

  try {
    const response = await fetch(site.community.icsUrl, {
      headers: {
        Accept: "text/calendar, text/plain",
        "User-Agent": "KritiSite/1.0",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`calendar ${response.status}`);
    const events = parseIcs(await response.text());
    return { upcoming: upcomingEvents(events), past: pastEvents(events), source: "live" };
  } catch (error) {
    console.error("[community] using saved event", error);
    const saved = [...site.community.fallbackEvents];
    return {
      upcoming: upcomingEvents(saved),
      past: pastEvents(saved),
      source: "fallback",
    };
  }
}
