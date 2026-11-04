import { External } from "@/components/external";

export function WorkSection({
  kicker,
  title,
  lede,
  points,
  links,
}: {
  kicker: string;
  title: string;
  lede: string;
  points: readonly { title: string; body: string }[];
  links: readonly { label: string; href: string }[];
}) {
  return (
    <section className="band" id="work" aria-labelledby="work-heading">
      <div className="wrap split">
        <div>
          <p className="script kicker">{kicker}</p>
          <h1 id="work-heading">{title}</h1>
          <p className="lede">{lede}</p>
          <ul className="text-links">
            {links.map((link) => (
              <li key={link.href}>
                <External href={link.href}>{link.label}</External>
              </li>
            ))}
          </ul>
        </div>
        <ul className="point-list">
          {points.map((point) => (
            <li key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
