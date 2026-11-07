import Link from "next/link";
import { External } from "@/components/external";
import { StarterDemo } from "@/components/starter-demo";

export function ProjectsSection({
  kicker,
  title,
  badge,
  lede,
  url,
  tryLabel,
  steps,
  note,
  cta,
  anchorId = "projects",
}: {
  kicker: string;
  title: string;
  badge: string;
  lede: string;
  url: string | null;
  tryLabel: string;
  steps: readonly { title: string; body: string }[];
  note: string;
  cta: { label: string; href: string };
  anchorId?: string;
}) {
  return (
    <section className="band" id={anchorId} aria-labelledby="projects-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <div className="section-head">
          <h2 id="projects-heading">
            {title} <span className="sw-badge">{badge}</span>
          </h2>
          <Link className="text-link" href={cta.href}>
            {cta.label}
          </Link>
        </div>
        <p className="lede">{lede}</p>

        <div className="wins-layout">
          <div>
            <ol className="wins-steps">
              {steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <div className="hero-actions wins-actions">
              {url ? (
                <External className="btn btn-ink" href={url}>
                  {tryLabel} →
                </External>
              ) : null}
            </div>
            <p className="note wins-note">
              {note.split(/(hike log|bookshelf)/).map((part) =>
                part === "hike log" ? (
                  <Link key={part} href="/hikes">
                    hike log
                  </Link>
                ) : part === "bookshelf" ? (
                  <Link key={part} href="/books">
                    bookshelf
                  </Link>
                ) : (
                  part
                ),
              )}
            </p>
          </div>
          <StarterDemo compact />
        </div>
      </div>
    </section>
  );
}
