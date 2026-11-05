import { External } from "@/components/external";

type Stop = { id: string; title: string; url: string };

function short(title: string) {
  return title.length > 28 ? `${title.slice(0, 26)}…` : title;
}

export function MetroLine({ stops }: { stops: readonly Stop[] }) {
  if (stops.length === 0) return null;
  return (
    <ol className="metro" aria-label="Meetups along the line">
      {stops.map((stop) => (
        <li key={stop.id}>
          {stop.url ? (
            <External className="station" href={stop.url}>
              {short(stop.title)}
            </External>
          ) : (
            <span className="station">{short(stop.title)}</span>
          )}
        </li>
      ))}
    </ol>
  );
}
