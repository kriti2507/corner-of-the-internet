import Link from "next/link";

export function ConsultingSection({
  kicker,
  title,
  lede,
  services,
  howTitle,
  steps,
  cta,
}: {
  kicker: string;
  title: string;
  lede: string;
  services: readonly { title: string; body: string }[];
  howTitle: string;
  steps: readonly string[];
  cta: { label: string; href: string };
}) {
  return (
    <section className="band" aria-labelledby="consulting-heading">
      <div className="wrap split">
        <div>
          <p className="script kicker">{kicker}</p>
          <h1 id="consulting-heading">{title}</h1>
          <p className="lede">{lede}</p>
          <h2 className="subhead" id="consulting-how">
            {howTitle}
          </h2>
          <ol className="challenge">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <Link className="btn btn-yellow consulting-cta" href={cta.href}>
            {cta.label}
          </Link>
        </div>
        <ul className="point-list">
          {services.map((service) => (
            <li key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
