import Link from "next/link";
import { External } from "@/components/external";

export function ProjectsSection({
  kicker,
  title,
  lede,
  url,
  points,
  note,
  cta,
  others = [],
  anchorId = "projects",
}: {
  kicker: string;
  title: string;
  lede: string;
  url: string | null;
  points: readonly string[];
  note: string;
  cta: { label: string; href: string };
  others?: readonly {
    kicker: string;
    tone: "blue" | "pink" | "yellow" | "green" | "peach";
    tilt: string;
    title: string;
    body: string;
    href: string;
    link: string;
  }[];
  anchorId?: string;
}) {
  return (
    <section className="band" id={anchorId} aria-labelledby="projects-heading">
      <div className="wrap project-layout">
        <article className="sticker tone-yellow project-feature" data-tilt="2">
          <p className="script kicker">{kicker}</p>
          <h2 id="projects-heading">{title}</h2>
          <p className="lede">{lede}</p>
          {url ? (
            <External className="btn btn-ink" href={url}>
              Open Small Wins →
            </External>
          ) : (
            <Link className="btn btn-ink" href={cta.href}>
              {cta.label}
            </Link>
          )}
        </article>
        <div>
          <ol className="challenge">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>
          <p className="note">{note}</p>
          {others.length > 0 ? (
            <ul className="side-grid">
              {others.map((item) => (
                <li key={item.href}>
                  <Link className={`sticker tone-${item.tone}`} data-tilt={item.tilt} href={item.href}>
                    <p className="card-kicker">{item.kicker}</p>
                    <h3>{item.title}</h3>
                    <p className="card-body">{item.body}</p>
                    <span className="card-link">{item.link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
