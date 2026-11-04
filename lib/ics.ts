import type { CalendarEvent } from "@/content/site";

function unfold(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

function unescapeText(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function parseDate(value: string, params: string): string | null {
  const match = value
    .trim()
    .match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4] ?? 0);
  const minute = Number(match[5] ?? 0);
  const second = Number(match[6] ?? 0);
  const zulu = match[7] === "Z" || !match[4];
  const tz = /TZID=([^;:]+)/.exec(params)?.[1] ?? "";
  const tokyo = tz === "Asia/Tokyo";
  const utc = tokyo
    ? Date.UTC(year, month - 1, day, hour - 9, minute, second)
    : Date.UTC(year, month - 1, day, hour, minute, second);
  if (!zulu && !tokyo && match[4]) {
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second)).toISOString();
  }
  const date = new Date(utc);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function propMap(block: string) {
  const props = new Map<string, { value: string; params: string }>();
  for (const line of block.split("\n")) {
    if (!line || line.startsWith("BEGIN:") || line.startsWith("END:")) continue;
    const idx = line.indexOf(":");
    if (idx < 1) continue;
    const left = line.slice(0, idx);
    const raw = line.slice(idx + 1);
    const [name, ...params] = left.split(";");
    props.set(name.toUpperCase(), {
      value: unescapeText(raw),
      params: params.join(";"),
    });
  }
  return props;
}

export function parseIcs(text: string): CalendarEvent[] {
  const unfolded = unfold(text);
  const blocks = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? [];
  const events: CalendarEvent[] = [];
  for (const block of blocks) {
    const props = propMap(block);
    const status = props.get("STATUS")?.value.toUpperCase() ?? "";
    if (status === "CANCELLED") continue;
    const startProp = props.get("DTSTART");
    const start = startProp ? parseDate(startProp.value, startProp.params) : null;
    if (!start) continue;
    const endProp = props.get("DTEND");
    const end = endProp ? parseDate(endProp.value, endProp.params) : null;
    const summary = props.get("SUMMARY")?.value || "Untitled event";
    const location = (props.get("LOCATION")?.value ?? "").replace(/\s+/g, " ");
    const description = props.get("DESCRIPTION")?.value ?? "";
    const explicit = props.get("URL")?.value ?? "";
    const found = description.match(/https:\/\/luma\.com\/[^\s]+/);
    const url = explicit || found?.[0] || "";
    const uid = props.get("UID")?.value || `${start}-${summary}`;
    events.push({
      id: uid,
      title: summary,
      start,
      end,
      location,
      url,
    });
  }
  events.sort((a, b) => (a.start < b.start ? -1 : 1));
  return events;
}

function eventEnd(event: CalendarEvent) {
  const end = event.end ? Date.parse(event.end) : Date.parse(event.start);
  return Number.isFinite(end) ? end : null;
}

export function upcomingEvents(events: CalendarEvent[], now = Date.now()) {
  return events.filter((event) => {
    const end = eventEnd(event);
    return end != null && end >= now;
  });
}

export function pastEvents(events: CalendarEvent[], now = Date.now()) {
  return events
    .filter((event) => {
      const end = eventEnd(event);
      return end != null && end < now;
    })
    .sort((a, b) => (a.start < b.start ? 1 : a.start > b.start ? -1 : 0));
}
