import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NoteList, TagLinks } from "@/components/notes";
import { site } from "@/content/site";
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
    title: hike.title,
    description: `${hike.title} in ${hike.region}, logged ${hike.date}.`,
  };
}

export default async function HikePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hike = getHike(slug);
  if (!hike) notFound();
  const notes = postsMentioning("hikes", hike.slug);

  return (
    <section className="band" aria-labelledby="hike-heading">
      <div className="wrap journal">
        <Breadcrumbs
          items={[
            { label: site.weekends.title, href: "/weekends" },
            { label: site.hikes.title, href: "/hikes" },
            { label: hike.title },
          ]}
        />
        <p className="script kicker">{hike.region}</p>
        <h1 id="hike-heading">{hike.title}</h1>
        <p className="lede">
          <time dateTime={hike.date}>{formatDay(hike.date)}</time>
        </p>
        <dl className="detail-stats">
          <div>
            <dt>Mountain height</dt>
            <dd>{formatMeters(hike.heightM)}</dd>
          </div>
          <div>
            <dt>Metres climbed</dt>
            <dd>{formatMeters(hike.climbedM)}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{formatDuration(hike.durationMin)}</dd>
          </div>
        </dl>
        {hike.pinApproximate ? <p className="quiet-note">{site.hikes.approxNote}</p> : null}
        <TagLinks tags={hike.tags} />
        <p>
          <Link href="/hikes">Back to the map →</Link>
        </p>
        <h2 className="subhead">Notes</h2>
        <NoteList notes={notes} empty="No notes point at this trail yet." />
      </div>
    </section>
  );
}
