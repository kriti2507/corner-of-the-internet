import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("about");

/** Turns "[label](href)" inside a paragraph into a link. */
function withLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    parts.push(
      <Link key={index} href={match[2]}>
        {match[1]}
      </Link>,
    );
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function AboutPage() {
  const page = site.aboutPage;

  return (
    <>
      <section className="band band-tight" aria-labelledby="about-page-heading">
        <div className="wrap">
          <p className="script kicker">{page.kicker}</p>
          <h1 id="about-page-heading">{page.title}</h1>
          <p className="lede">{page.lede}</p>
          <nav aria-label="Chapters">
            <ol className="story-toc">
              {page.chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a href={`#${chapter.id}`}>{chapter.place}</a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <section className="band" aria-label="The story">
        <div className="wrap">
          <ol className="story">
            {page.chapters.map((chapter) => (
              <li key={chapter.id} id={chapter.id} className="story-chapter">
                <article>
                  <header className="story-head">
                    <p className="card-kicker">
                      <span className={`story-pin tone-${chapter.tone}`}>{chapter.when}</span>
                      {chapter.place}
                    </p>
                    <h2 className="story-title">{chapter.title}</h2>
                  </header>

                  <div className={chapter.odds ? "story-body has-aside" : "story-body"}>
                    <div className="story-text">
                      {chapter.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{withLinks(paragraph)}</p>
                      ))}
                    </div>

                    {chapter.odds ? (
                      <aside className="story-odds" aria-label={chapter.odds.title}>
                        <span className={`tape tape-${chapter.odds.tape}`} aria-hidden="true" />
                        <p className="script story-odds-title">{chapter.odds.title}</p>
                        <dl>
                          {chapter.odds.rows.map((row) => (
                            <div key={row.label}>
                              <dt>{row.n}</dt>
                              <dd>{row.label}</dd>
                            </div>
                          ))}
                        </dl>
                        <p className="story-odds-note">{chapter.odds.note}</p>
                      </aside>
                    ) : null}
                  </div>

                  {chapter.dot ? (
                    <p className="story-dot">
                      <span className="script story-dot-label">the dot →</span>
                      <span>{chapter.dot.text}</span>{" "}
                      <Link className="card-link" href={chapter.dot.href}>
                        {chapter.dot.link}
                      </Link>
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band" aria-labelledby="dots-heading">
        <div className="wrap">
          <p className="script kicker">{page.dots.kicker}</p>
          <h2 id="dots-heading">{page.dots.title}</h2>
          <ul className="dots-map">
            {page.dots.items.map((item) => (
              <li key={item.then}>
                <Link href={item.href}>
                  <span className="dots-then">{item.then}</span>
                  <span className="dots-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="sr-only">became</span>
                  <span className="dots-now">{item.now}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="story-closer">
            <span className="script">{page.closer}</span>{" "}
            <Link className="card-link" href={page.closerLink.href}>
              {page.closerLink.label}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
