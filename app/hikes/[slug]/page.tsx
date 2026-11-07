import Link from "next/link";
import { notFound } from "next/navigation";
import "@/app/weekends.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NoteList, TagLinks } from "@/components/notes";
import { site } from "@/content/site";
import { weekends } from "@/content/weekends";
import { formatDay, formatDuration, formatMeters } from "@/lib/format";
import { getHike, getHikes } from "@/lib/hikes";
import { postsMentioning } from "@/lib/journal";

export function generateStaticParams() {
  return getHikes().map((hike) => ({ slug: hike.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hike = getHike(slug);
  if (!hike) return {};
  return {
    title: `${hike.title}, ${hike.region}`,
    description: `${hike.title} in ${hike.region}, hiked ${formatDay(hike.date)}. Summit ${formatMeters(hike.heightM)}, ${formatMeters(hike.climbedM)} climbed.`,
    alternates: { canonical: `/hikes/${hike.slug}` },
  };
}

export default async function HikePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hike = getHike(slug);
  if (!hike) notFound();
  const notes = postsMentioning("hikes", hike.slug);
  const hikes = getHikes();
  const index = hikes.findIndex((item) => item.slug === hike.slug);
  const earlier = hikes[index - 1];
  const later = hikes[index + 1];
  const number = index + 1;

  return (
    <section className="band wk-scope" data-lane="hikes" aria-labelledby="hike-heading">
      <div className="wrap">
        <Breadcrumbs
          items={[
            { label: weekends.title, href: "/weekends" },
            { label: weekends.lanes.hikes.label, href: "/hikes" },
            { label: hike.title },
          ]}
        />
        <div className="wk-detail">
          <div className="wk-detail-main">
            <p className="script kicker">hike {number} of {hikes.length}</p>
            <h1 id="hike-heading">{hike.title}</h1>
            <p className="lede" style={{ margin: 0 }}>
              {hike.region} · <time dateTime={hike.date}>{formatDay(hike.date)}</time>
            </p>
            {hike.pinApproximate ? <p className="wk-muted" style={{ margin: 0 }}>{site.hikes.approxNote}</p> : null}
            <TagLinks tags={hike.tags} />
            {notes.length > 0 ? (
              <>
                <h2 className="subhead">Notes</h2>
                <NoteList notes={notes} empty="" />
              </>
            ) : null}
            <nav className="wk-pager" aria-label="Earlier and later hikes">
              {earlier ? (
                <Link href={`/hikes/${earlier.slug}`}>
                  <small>← Earlier</small>
                  <span>{earlier.title}</span>
                </Link>
              ) : null}
              {later ? (
                <Link href={`/hikes/${later.slug}`}>
                  <small>Later →</small>
                  <span>{later.title}</span>
                </Link>
              ) : null}
            </nav>
          </div>
          <aside className="wk-card" aria-label="Hike stats">
            <dl className="wk-facts">
              <div>
                <dt>Summit</dt>
                <dd>{formatMeters(hike.heightM)}</dd>
              </div>
              <div>
                <dt>Climbed</dt>
                <dd>{formatMeters(hike.climbedM)}</dd>
              </div>
              <div>
                <dt>On the trail</dt>
                <dd>{formatDuration(hike.durationMin)}</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>{hike.region}</dd>
              </div>
            </dl>
            <p style={{ margin: 0, padding: "0 1.1rem 1rem" }}>
              <Link className="wk-link" href="/hikes">
                All the hikes →
              </Link>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
