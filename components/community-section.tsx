import type { CalendarEvent } from "@/content/site";
import { External } from "@/components/external";
import { formatTokyo } from "@/lib/format";

/**
 * Venue + city, no street or postal code:
 * "Chotto Matcha - Asakusa, Taito City, Tokyo 111-0033, Japan" → "Chotto Matcha Asakusa · Tokyo".
 */
function shortPlace(location: string) {
  const parts = location
    .split(",")
    .map((part) => part.replace(/\b\d{3}-?\d{4}\b/g, "").replace(/\s{2,}/g, " ").trim())
    .filter((part) => part && !/^japan$/i.test(part));
  const venue = (parts[0] ?? "").replace(/\s+-\s+/g, " ");
  const city = parts.length > 1 ? parts.at(-1) : undefined;
  return city ? `${venue} · ${city}` : venue;
}

/** Luma titles repeat the brand ("Women x Tech · Tokyo · Connections over Matcha"); keep the event name. */
function eventName(title: string) {
  const parts = title.split("·").map((part) => part.trim()).filter(Boolean);
  return parts.at(-1) ?? title;
}

function tokyoParts(iso: string) {
  const date = new Date(iso);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Tokyo", ...options }).format(date);
  return {
    month: part({ month: "short" }),
    day: part({ day: "numeric" }),
    weekday: part({ weekday: "short" }),
    time: part({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  };
}

function timeRange(start: string, end: string | null) {
  const from = tokyoParts(start).time;
  if (!end || Number.isNaN(new Date(end).getTime())) return `${from} JST`;
  return `${from}–${tokyoParts(end).time} JST`;
}

export function CommunitySection({
  kicker,
  title,
  lede,
  events,
  source,
  fallbackNote,
  empty,
  calendarUrl,
  calendarLabel,
  saveLabel,
  nextLabel,
  past = [],
  pastTitle,
  pastLink,
}: {
  kicker: string;
  title: string;
  lede: string;
  events: CalendarEvent[];
  source: "live" | "fallback";
  fallbackNote: string;
  empty: string;
  calendarUrl: string;
  calendarLabel: string;
  saveLabel: string;
  nextLabel?: string;
  past?: CalendarEvent[];
  pastTitle: string;
  pastLink: string;
}) {
  return (
    <section className="band" id="community" aria-labelledby="community-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <div className="section-head">
          <h2 id="community-heading">{title}</h2>
          <External className="text-link" href={calendarUrl}>
            {calendarLabel}
          </External>
        </div>
        <p className="lede">{lede}</p>
        {source === "fallback" && events.length > 0 ? (
          <p className="quiet-note">{fallbackNote}</p>
        ) : null}
        {events.length === 0 ? (
          <p className="empty-card">{empty}</p>
        ) : (
          <ul className="event-list">
            {events.map((event) => {
              const when = tokyoParts(event.start);
              return (
                <li key={event.id} className="sticker meetup-card" data-tilt="4">
                  <div className="meetup-date" aria-hidden="true">
                    <span className="meetup-month">{when.month}</span>
                    <span className="meetup-day">{when.day}</span>
                    <span className="meetup-weekday">{when.weekday}</span>
                  </div>
                  <div className="meetup-body">
                    <p className="card-kicker">{nextLabel ?? "Next meetup"}</p>
                    <h3>{eventName(event.title)}</h3>
                    <p className="meetup-meta">
                      <time dateTime={event.start}>
                        <span className="sr-only">{formatTokyo(event.start)}, </span>
                        {timeRange(event.start, event.end)}
                      </time>
                      {event.location ? (
                        <>
                          <span aria-hidden="true"> · </span>
                          {shortPlace(event.location)}
                        </>
                      ) : null}
                    </p>
                    {event.url ? (
                      <External className="btn btn-ink meetup-cta" href={event.url}>
                        {saveLabel}
                      </External>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {past.length > 0 ? (
          <>
            <h2 className="subhead">{pastTitle}</h2>
            <ul className="post-grid">
              {past.map((event) => {
                const body = (
                  <>
                    <time dateTime={event.start}>{formatTokyo(event.start)}</time>
                    <h3>{eventName(event.title)}</h3>
                    {event.location ? <p>{shortPlace(event.location)}</p> : null}
                    {event.url ? <span className="card-link">{pastLink}</span> : null}
                  </>
                );
                return (
                  <li key={event.id}>
                    {event.url ? (
                      <External className="post-card" href={event.url}>
                        {body}
                      </External>
                    ) : (
                      <article className="post-card">{body}</article>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
