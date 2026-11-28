import Link from "next/link";
import { notFound } from "next/navigation";
import "@/app/weekends.css";
import "@/app/scrapbook.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HikePicture } from "@/components/hikes/hike-card";
import { NoteList, TagLinks } from "@/components/notes";
import { site } from "@/content/site";
import { weekends } from "@/content/weekends";
import { formatDay, formatDuration, formatMeters } from "@/lib/format";
import { getHike, getHikes, hasNotes } from "@/lib/hikes";
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

const NOTE_PARTS = [
  { key: "access", label: "Getting there", tone: "tone-blue", tilt: "1" },
  { key: "trail", label: "The trail", tone: "tone-green", tilt: "2" },
  { key: "feeling", label: "How it felt", tone: "tone-pink", tilt: "3" },
] as const;

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
  const climbShare = Math.min(100, Math.round((hike.climbedM / hike.heightM) * 100));

  return (
    <div className="sb-scope wk-scope" data-lane="hikes">
      <section className="sb-hero-band" aria-labelledby="hike-heading">
        <div className="wrap sb-hero sb-hero-detail">
          <div className="sb-hero-text">
            <Breadcrumbs
              items={[
                { label: weekends.title, href: "/weekends" },
                { label: weekends.lanes.hikes.label, href: "/hikes" },
                { label: hike.title },
              ]}
            />
            <p className="script sb-hello">
              hike {number} of {hikes.length}
            </p>
            <h1 id="hike-heading" className="sb-title sb-title-detail">
              {hike.title}
            </h1>
            <p className="sb-lead">
              <mark className="mark mark-blue">{hike.region}</mark>, <time dateTime={hike.date}>{formatDay(hike.date)}</time>
              {hike.days > 1 ? (
                <>
                  , <mark className="mark mark-yellow">{hike.days} days</mark> on the mountain
                </>
              ) : null}
              .
            </p>
            {hike.pinApproximate ? <p className="wk-muted sb-small">{site.hikes.approxNote}</p> : null}
            <TagLinks tags={hike.tags} />
          </div>
          <div className="sb-hero-photos sb-hero-photos-one">
            <figure className="sb-polaroid sb-hero-polaroid sb-hero-single">
              <span className="sb-tape sb-tape-yellow" aria-hidden="true" />
              <span className="sb-frame">
                <HikePicture hike={hike} />
              </span>
              <figcaption>
                <span className="sb-polaroid-script">{hike.photo ? "from the trail" : "drawn, until I add a photo"}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="sb-band sb-band-cream" aria-label="Hike stats">
        <div className="wrap">
          <ul className="sb-stickers">
            <li className="sb-sticker tone-green" data-tilt="1">
              <span className="sb-sticker-num">{formatMeters(hike.heightM)}</span>
              <span className="sb-sticker-label">summit</span>
            </li>
            <li className="sb-sticker tone-yellow" data-tilt="2">
              <span className="sb-sticker-num">{formatMeters(hike.climbedM)}</span>
              <span className="sb-sticker-label">climbed on foot{climbShare < 100 ? `, ${climbShare}% of the mountain` : ""}</span>
            </li>
            <li className="sb-sticker tone-blue" data-tilt="3">
              <span className="sb-sticker-num">{hike.durationMin == null ? "—" : formatDuration(hike.durationMin)}</span>
              <span className="sb-sticker-label">{hike.durationMin == null ? "time not logged" : "on the trail"}</span>
            </li>
          </ul>
        </div>
      </section>

      {hasNotes(hike) ? (
        <section className="sb-band sb-band-green" aria-labelledby="notes-heading">
          <div className="wrap">
            <div className="sb-section-head">
              <p className="script kicker">field notes</p>
              <h2 id="notes-heading">What I want to remember</h2>
            </div>
            <ul className="sb-notes">
              {NOTE_PARTS.map((part) =>
                hike.notes[part.key] ? (
                  <li key={part.key} className={`sb-sticker sb-note ${part.tone}`} data-tilt={part.tilt}>
                    <span className="card-kicker">{part.label}</span>
                    <p>{hike.notes[part.key]}</p>
                  </li>
                ) : null,
              )}
              {hike.huts.length > 0 ? (
                <li className="sb-sticker sb-note tone-peach" data-tilt="4">
                  <span className="card-kicker">{hike.huts.length === 1 ? "The hut" : "The huts"}</span>
                  <ol className="sb-huts">
                    {hike.huts.map((hut, i) => (
                      <li key={`${hut}-${i}`}>
                        <span className="script">night {i + 1}</span> {hut}
                      </li>
                    ))}
                  </ol>
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="sb-band" aria-label="More">
        <div className="wrap sb-detail-foot">
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
          <p>
            <Link className="wk-link" href="/hikes">
              All the hikes →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
