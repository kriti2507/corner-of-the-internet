export function formatDay(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  if (!year || !month || !day) return ymd;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function formatTokyo(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return `${formatted} JST`;
}

export function formatPostDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function badgeParts(iso: string) {
  const date = new Date(iso);
  const month = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    month: "short",
  }).format(date);
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    day: "numeric",
  }).format(date);
  const year = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "2-digit",
  }).format(date);
  return { month, day, year: `’${year}` };
}

export function formatDuration(minutes: number | null) {
  if (minutes == null) return "not logged";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}m`;
}

export function formatMeters(meters: number) {
  return `${meters.toLocaleString("en-US")} m`;
}

export function formatHours(minutes: number) {
  const hours = Math.round(minutes / 60);
  return `${hours.toLocaleString("en-US")} hours`;
}
