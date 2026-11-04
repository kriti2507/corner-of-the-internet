import { External } from "@/components/external";

export function ProjectsSection({
  kicker,
  title,
  lede,
  url,
  points,
  note,
  cta,
}: {
  kicker: string;
  title: string;
  lede: string;
  url: string | null;
  points: readonly string[];
  note: string;
  cta: { label: string; href: string };
}) {
  return (
    <section className="band" id="projects" aria-labelledby="projects-heading">
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
            <a className="btn btn-ink" href={cta.href}>
              {cta.label}
            </a>
          )}
        </article>
        <div>
          <ol className="challenge">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ol>
          <p className="note">{note}</p>
        </div>
      </div>
    </section>
  );
}
