import Link from "next/link";
import { External } from "@/components/external";
import { SakanaNoteCard, type SakanaCard } from "@/components/sakana";
import { formatDay } from "@/lib/format";

/** Home page Sakana block: who I am at Sakana on the left, the newest notes on the right. */
export function WorkSection({
  kicker,
  title,
  titleMark,
  lede,
  notes,
  total,
  labels,
  links,
  anchorId = "work",
}: {
  kicker: string;
  title: string;
  titleMark: string;
  lede: string;
  notes: readonly SakanaCard[];
  total: number;
  labels: { readAll: string; allNotes: string; newest: string; note: string; minutes: string; countLine: string; empty: string };
  links: readonly { label: string; href: string }[];
  anchorId?: string;
}) {
  const newest = notes[0];
  return (
    <section className="band" id={anchorId} aria-labelledby="work-heading">
      <div className="wrap split sk-home">
        <div className="sk-home-intro">
          <p className="script kicker">{kicker}</p>
          <h2 id="work-heading">
            {title} <span className="mark mark-blue">{titleMark}</span>
          </h2>
          <p className="lede">{lede}</p>
          {newest ? (
            <p className="sk-count">
              {labels.countLine.replace("{n}", String(total)).replace("{date}", formatDay(newest.date))}
            </p>
          ) : null}
          <div className="hero-actions">
            <Link className="btn btn-ink" href="/sakana">
              {labels.readAll} →
            </Link>
          </div>
          <ul className="text-links">
            {links.map((link) => (
              <li key={link.href}>
                <External href={link.href}>{link.label}</External>
              </li>
            ))}
          </ul>
        </div>
        <div className="sk-home-notes">
          {notes.length === 0 ? (
            <p className="quiet-note">{labels.empty}</p>
          ) : (
            <ol className="sk-stack">
              {notes.map((note, index) => (
                <li key={note.slug}>
                  <SakanaNoteCard
                    note={note}
                    noteLabel={labels.note}
                    minutesLabel={labels.minutes}
                    tape={index === 0 ? labels.newest : undefined}
                    tilt={index + 1}
                  />
                </li>
              ))}
            </ol>
          )}
          {total > notes.length ? (
            <p className="sk-all">
              <Link href="/sakana">{labels.allNotes.replace("{n}", String(total))}</Link>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
