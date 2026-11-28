import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { External } from "@/components/external";
import { SakanaNoteCard } from "@/components/sakana";
import { site } from "@/content/site";
import { sakanaNotes } from "@/lib/journal";

const page = site.work.index;

export const metadata: Metadata = {
  title: `${page.kicker} ${page.title.toLowerCase()}`,
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: {
    title: `${page.kicker} ${page.title.toLowerCase()} · ${site.name}`,
    description: page.description,
    url: page.path,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
};

export default function SakanaPage() {
  const notes = sakanaNotes();
  const first = notes[notes.length - 1];
  const minutes = notes.reduce((sum, note) => sum + note.minutes, 0);

  return (
    <div className="sk-scope">
      <section className="band sk-index" aria-labelledby="sakana-heading">
        <div className="wrap">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: page.crumb }]} />
          <div className="sk-index-layout">
            <header className="sk-index-head">
              <p className="script kicker">{page.kicker}</p>
              <h1 id="sakana-heading">{page.title}</h1>
              <p className="lede">{page.lede}</p>
              {notes.length > 0 ? (
                <ul className="sk-stats" aria-label="At a glance">
                  <li>
                    <strong>{notes.length}</strong> notes
                  </li>
                  <li>
                    <strong>{minutes}</strong> min of reading
                  </li>
                  {first && notes.length > 1 ? (
                    <li className="sk-stats-link">
                      <a href={`#note-${first.number}`}>{page.startNote}</a>
                    </li>
                  ) : null}
                </ul>
              ) : null}
              <ul className="text-links">
                {site.work.links.map((link) => (
                  <li key={link.href}>
                    <External href={link.href}>{link.label}</External>
                  </li>
                ))}
              </ul>
            </header>
            {notes.length === 0 ? (
              <p className="quiet-note">{site.work.empty}</p>
            ) : (
              <ol className="sk-list" reversed>
                {notes.map((note, index) => (
                  <li key={note.slug} id={`note-${note.number}`}>
                    <SakanaNoteCard
                      note={note}
                      noteLabel={site.work.note}
                      minutesLabel={site.work.minutes}
                      tape={index === 0 ? site.work.newest : note.number === 1 ? site.work.startHere : undefined}
                      tilt={(index % 5) + 1}
                      heading="h2"
                    />
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
