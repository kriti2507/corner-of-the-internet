import Link from "next/link";

export function ConsultingSection({
  kicker,
  title,
  lede,
  cta,
  aboutCta,
}: {
  kicker: string;
  title: string;
  lede: string;
  cta: { label: string; href: string };
  aboutCta: { label: string; href: string };
}) {
  return (
    <section className="band band-tight" id="consulting" aria-labelledby="consulting-heading">
      <div className="wrap consulting-teaser">
        <div>
          <p className="script kicker">{kicker}</p>
          <h2 id="consulting-heading">{title}</h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="hero-actions">
          <Link className="btn btn-ink" href={cta.href}>
            {cta.label}
          </Link>
          <Link className="btn btn-ghost" href={aboutCta.href}>
            {aboutCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
