import Link from "next/link";
import { NoteList } from "@/components/notes";
import { site } from "@/content/site";
import { getJournalPosts } from "@/lib/journal";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("blog");

export default function BlogPage() {
  const notes = getJournalPosts();

  return (
    <section className="band" aria-labelledby="blog-heading">
      <div className="wrap">
        <p className="script kicker">{site.blog.kicker}</p>
        <h1 id="blog-heading">{site.blog.title}</h1>
        <p className="lede">{site.blog.lede}</p>
        <p className="note">
          <Link href="/writing">AI Noodle and the journal together →</Link>
        </p>
        <NoteList notes={notes} empty={site.blog.empty} />
      </div>
    </section>
  );
}
