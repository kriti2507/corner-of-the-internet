import Link from "next/link";
import { Lora } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("about");

/** A text serif for the long-form story, so it reads like a story. */
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

/** Turns "[label](href)" inside a paragraph into a link. */
function withLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    const href = match[2];
    parts.push(
      href.startsWith("http") ? (
        <a key={index} href={href} target="_blank" rel="noopener noreferrer">
          {match[1]}
        </a>
      ) : (
        <Link key={index} href={href}>
          {match[1]}
        </Link>
      ),
    );
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function AboutPage() {
  const page = site.aboutPage;

  return (
    <div className={`about-story ${lora.variable}`}>
      <section className="band band-tight" aria-labelledby="about-page-heading">
        <div className="wrap">
          <p className="script kicker">{page.kicker}</p>
          <h1 id="about-page-heading">{page.title}</h1>
          <blockquote className="story-quote">
            <p>{page.lede}</p>
            <cite>{page.ledeCredit}</cite>
          </blockquote>
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
                      {chapter.paragraphs.map((paragraph) => {
                        const big = typeof paragraph !== "string";
                        const text = big ? paragraph.text : paragraph;
                        return (
                          <p key={text} className={big ? "story-big" : undefined}>
                            {withLinks(text)}
                          </p>
                        );
                      })}
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
                      {chapter.dot.text}{" "}
                      <Link className="card-link" href={chapter.dot.href}>
                        {chapter.dot.link}
                      </Link>
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
          <p className="story-closer">
            <span className="script">{page.closer}</span>{" "}
            <Link className="card-link" href={page.closerLink.href}>
              {page.closerLink.label}
            </Link>
          </p>
        </div>
      </section>

    </div>
  );
}
