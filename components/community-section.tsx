import type { CalendarEvent } from "@/content/site";
import { External } from "@/components/external";
import { formatTokyo } from "@/lib/format";

function shortPlace(location: string) {
  if (location.length < 72) return location;
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  const city = parts.find((part) => /tokyo/i.test(part)) ?? parts.at(-1);
  return city && city !== parts[0] ? `${parts[0]} · ${city}` : parts[0];
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
            {events.map((event) => (
              <li key={event.id} className="sticker tone-green event-card" data-tilt="4">
                <p className="card-kicker">On the calendar</p>
                <h3>{event.title}</h3>
                <p>
                  <time dateTime={event.start}>{formatTokyo(event.start)}</time>
                </p>
                {event.location ? <p>{shortPlace(event.location)}</p> : null}
                {event.url ? (
                  <External className="card-link" href={event.url}>
                    {saveLabel}
                  </External>
                ) : null}
              </li>
            ))}
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
                    <h3>{event.title}</h3>
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
