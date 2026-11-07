import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import { formatDay } from "@/lib/format";
import { postsInSeries } from "@/lib/journal";
import { SampleMark } from "@/components/notes";

function getSeries(slug: string) {
  return site.work.series.find((item) => item.slug === slug) ?? null;
}

export function generateStaticParams() {
  return site.work.series.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) return {};
  return {
    title: `${series.title} · ${site.work.seriesKicker}`,
    description: series.intro,
    alternates: { canonical: `/series/${series.slug}` },
  };
}

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) notFound();
  const notes = postsInSeries(series.slug);
  const others = site.work.series.filter((item) => item.slug !== series.slug);

  return (
    <section className="band" aria-labelledby="series-heading">
      <div className="wrap">
        <p className="script kicker">{site.work.seriesKicker}</p>
        <h1 id="series-heading">{series.title}</h1>
        <p className="lede">{series.intro}</p>

        {notes.length === 0 ? (
          <p className="quiet-note">{site.work.seriesEmpty}</p>
        ) : (
          <ol className="post-grid series-list">
            {notes.map((note, index) => {
              const inner = (
                <>
                  {note.sample ? <SampleMark /> : null}
                  <span className="card-kicker">
                    {site.work.seriesPart} {note.part ?? index + 1}
                  </span>
                  <h3>{note.title}</h3>
                  {note.summary ? <p>{note.summary}</p> : null}
                  <time dateTime={note.date}>{formatDay(note.date)}</time>
                  <span className="card-link">{note.external ? "On Substack →" : "Read →"}</span>
                </>
              );
              return (
                <li key={note.slug}>
                  {note.external ? (
                    <a className="post-card" href={note.external} target="_blank" rel="noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <Link className="post-card" href={`/blog/${note.slug}`}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        <ul className="text-links series-others">
          <li>
            <Link href="/#sakana">{site.work.seriesBack}</Link>
          </li>
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={`/series/${item.slug}`}>{item.title} →</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
