export type SkyPhase = "day" | "dusk" | "night";
export type TokyoSeason = "spring" | "summer" | "autumn" | "winter";
export type TokyoWeather = { temp: number; label: string };

export function tokyoParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? "0");
  return { hour: pick("hour"), minute: pick("minute"), month: pick("month") };
}

export function skyPhase(date = new Date()): SkyPhase {
  const { hour } = tokyoParts(date);
  if (hour >= 19 || hour < 6) return "night";
  if (hour >= 16) return "dusk";
  return "day";
}

/** Meteorological seasons in Tokyo. */
export function tokyoSeason(date = new Date()): TokyoSeason {
  const { month } = tokyoParts(date);
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export function tokyoClock(date = new Date()) {
  const { hour, minute } = tokyoParts(date);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
