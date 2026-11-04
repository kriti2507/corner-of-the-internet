import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteList, TagLinks } from "@/components/notes";
import { getCafe, getCafes } from "@/content/cafes";
import { site } from "@/content/site";
import { postsMentioning } from "@/lib/journal";

export function generateStaticParams() {
  return getCafes().map((cafe) => ({ slug: cafe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cafe = getCafe(slug);
  if (!cafe) return {};
  return {
    title: cafe.placeholder ? "Placeholder café" : cafe.name,
    description: cafe.note,
  };
}

export default async function CafePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cafe = getCafe(slug);
  if (!cafe) notFound();
  const notes = postsMentioning("cafes", cafe.slug);

  return (
    <section className="band" aria-labelledby="cafe-heading">
      <div className="wrap journal">
        <p className="script kicker">{site.coffee.kicker}</p>
        {cafe.placeholder ? <span className="tape tape-yellow placeholder-tape">Placeholder</span> : null}
        <h1 id="cafe-heading">{cafe.name}</h1>
        <p className="lede">
          {cafe.neighbourhood}
          {cafe.city ? ` · ${cafe.city}` : ""}
        </p>
        <p>{cafe.note}</p>
        <TagLinks tags={cafe.tags} />
        {cafe.mapUrl ? (
          <p>
            <a href={cafe.mapUrl}>Map →</a>
          </p>
        ) : null}
        <p>
          <Link href="/coffee">All the counters →</Link>
        </p>
        <h2 className="subhead">Notes</h2>
        <NoteList notes={notes} empty="No notes point at this counter yet." />
      </div>
    </section>
  );
}
