import Link from "next/link";
import { tagLabel } from "@/lib/slug";
import { formatDay } from "@/lib/format";

export function SampleMark() {
  return <span className="tape tape-yellow placeholder-tape">Sample</span>;
}

export function TagLinks({ tags }: { tags: readonly string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul className="tag-row">
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/tags/${tag}`}>{tagLabel(tag)}</Link>
        </li>
      ))}
    </ul>
  );
}

export type NoteRef = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  external: string | null;
  sample: boolean;
};

export function NoteList({ notes, empty }: { notes: NoteRef[]; empty: string }) {
  if (notes.length === 0) return <p className="quiet-note">{empty}</p>;
  return (
    <ul className="post-grid">
      {notes.map((note) => {
        const inner = (
          <>
            {note.sample ? <SampleMark /> : null}
            <time dateTime={note.date}>{formatDay(note.date)}</time>
            <h3>{note.title}</h3>
            {note.summary ? <p>{note.summary}</p> : null}
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
    </ul>
  );
}

export function toNoteRef(note: NoteRef): NoteRef {
  return note;
}
