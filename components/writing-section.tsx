import Link from "next/link";
import type { Post } from "@/content/site";
import { External } from "@/components/external";
import { formatPostDate } from "@/lib/format";

export function WritingSection({
  kicker,
  title,
  lede,
  posts,
  source,
  fallbackNote,
  publicationUrl,
  allLabel,
  seeAll,
  heading = "h1",
}: {
  kicker: string;
  title: string;
  lede: string;
  posts: Post[];
  source: "live" | "fallback";
  fallbackNote: string;
  publicationUrl: string;
  allLabel: string;
  seeAll?: { href: string; label: string };
  heading?: "h1" | "h2";
}) {
  const Title = heading;
  return (
    <section className="band" id="writing" aria-labelledby="writing-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <div className="section-head">
          <Title id="writing-heading">{title}</Title>
          {seeAll ? (
            <Link className="text-link" href={seeAll.href}>
              {seeAll.label}
            </Link>
          ) : (
            <External className="text-link" href={publicationUrl}>
              {allLabel}
            </External>
          )}
        </div>
        <p className="lede">{lede}</p>
        {source === "fallback" ? <p className="quiet-note">{fallbackNote}</p> : null}
        <ul className="post-grid">
          {posts.map((post) => (
            <li key={post.url}>
              <External className="post-card" href={post.url}>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <h3>{post.title}</h3>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
                <span className="card-link">Read →</span>
              </External>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
