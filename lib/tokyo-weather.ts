import "server-only";

import type { TokyoWeather } from "@/lib/tokyo";

export type { TokyoWeather };

function labelFor(code: number) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloud";
  if (code === 45 || code === 48) return "Fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 95) return "Storm";
  return "Cloud";
}

/** Open-Meteo needs no key. A failure hides the weather and leaves the clock. */
export async function getTokyoWeather(): Promise<TokyoWeather | null> {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=35.6762&longitude=139.6503&current=temperature_2m,weather_code&timezone=Asia%2FTokyo",
      { next: { revalidate: 1800 }, signal: AbortSignal.timeout(4000) },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      current?: { temperature_2m?: unknown; weather_code?: unknown };
    };
    const temp = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (typeof temp !== "number" || typeof code !== "number") return null;
    return { temp: Math.round(temp), label: labelFor(code) };
  } catch {
    return null;
  }
}
