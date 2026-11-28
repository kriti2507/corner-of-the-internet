import Link from "next/link";
import "@/app/sakana.css";
import { formatDay } from "@/lib/format";

export type SakanaCard = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  date: string;
  minutes: number;
};

export function noteNumber(n: number) {
  return String(n).padStart(2, "0");
}

/** One note as a numbered sticker. Used on the home page and on /sakana. */
export function SakanaNoteCard({
  note,
  noteLabel,
  minutesLabel,
  tape,
  tilt,
  heading = "h3",
}: {
  note: SakanaCard;
  noteLabel: string;
  minutesLabel: string;
  tape?: string;
  tilt?: number;
  heading?: "h2" | "h3";
}) {
  const Heading = heading;
  return (
    <Link className="sk-card" href={`/blog/${note.slug}`} data-tilt={tilt}>
      {tape ? <span className="tape tape-yellow sk-tape">{tape}</span> : null}
      <span className="sk-num" aria-hidden="true">
        {noteNumber(note.number)}
      </span>
      <span className="sk-card-text">
        <span className="sk-card-kicker">
          {noteLabel} {note.number} · <time dateTime={note.date}>{formatDay(note.date)}</time> ·{" "}
          {minutesLabel.replace("{n}", String(note.minutes))}
        </span>
        <Heading className="sk-card-title">{note.title}</Heading>
        {note.summary ? <span className="sk-card-summary">{note.summary}</span> : null}
      </span>
    </Link>
  );
}
