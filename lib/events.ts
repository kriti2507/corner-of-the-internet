import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { site, type CalendarEvent } from "@/content/site";
import { parseIcs, upcomingEvents } from "@/lib/ics";

export async function getEvents(): Promise<{
  upcoming: CalendarEvent[];
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
    const upcoming = upcomingEvents(parseIcs(await response.text()));
    return { upcoming, source: "live" };
  } catch (error) {
    console.error("[community] using saved event", error);
    return {
      upcoming: upcomingEvents([...site.community.fallbackEvents]),
      source: "fallback",
    };
  }
}
