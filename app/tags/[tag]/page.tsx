import { NoteList, TagLinks } from "@/components/notes";
import { placeWhere } from "@/content/places";
import { site } from "@/content/site";
import { forTag, allTags } from "@/lib/tags";
import { tagLabel } from "@/lib/slug";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const label = tagLabel(tag);
  return {
    title: label,
    description: `Notes, cafés, books, and hikes tagged ${label}.`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  if (!allTags().includes(tag)) notFound();
  const found = forTag(tag);
  const label = tagLabel(tag);

  return (
    <section className="band" aria-labelledby="tag-heading">
      <div className="wrap">
        <p className="script kicker">{site.tags.kicker}</p>
        <h1 id="tag-heading">{label}</h1>
        <p className="lede">{site.tags.lede}</p>

        <h2 className="subhead">{site.tags.notes}</h2>
        <NoteList notes={found.posts} empty={site.tags.emptyNotes} />

        <h2 className="subhead">{site.tags.cafes}</h2>
        {found.cafes.length === 0 ? (
          <p className="quiet-note">{site.tags.emptyCafes}</p>
        ) : (
          <ul className="cafe-grid">
            {found.cafes.map((cafe) => (
              <li key={cafe.slug} className="cafe-card">
                <h3>
                  <Link href={`/places/${cafe.slug}`}>{cafe.name}</Link>
                </h3>
                <p className="cafe-area">{placeWhere(cafe)}</p>
                <TagLinks tags={cafe.tags} />
              </li>
            ))}
          </ul>
        )}

        <h2 className="subhead">{site.tags.books}</h2>
        {found.books.length === 0 ? (
          <p className="quiet-note">{site.tags.emptyBooks}</p>
        ) : (
          <ul className="post-grid">
            {found.books.map((book) => (
              <li key={book.slug}>
                <Link className="post-card" href={`/books/${book.slug}`}>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <h2 className="subhead">{site.tags.hikes}</h2>
        {found.hikes.length === 0 ? (
          <p className="quiet-note">{site.tags.emptyHikes}</p>
        ) : (
          <ul className="post-grid">
            {found.hikes.map((hike) => (
              <li key={hike.slug}>
                <Link className="post-card" href={`/hikes/${hike.slug}`}>
                  <span className="card-kicker">{hike.region}</span>
                  <h3>{hike.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
