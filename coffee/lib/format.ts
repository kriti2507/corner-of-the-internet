export function yen(value?: number) {
  if (value === undefined) return undefined;
  return `¥${value.toLocaleString("en-US")}`;
}

export function day(value?: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00+09:00`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Tokyo" });
}

export function monthYear(value?: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00+09:00`);
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Asia/Tokyo" });
}

export function titleCase(value: string) {
  return value.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

/** Stable small hash so each coffee gets its own label colours. */
export function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
