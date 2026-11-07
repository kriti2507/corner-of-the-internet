import Link from "next/link";
import { External } from "@/components/external";

export type SeriesCard = {
  slug: string;
  title: string;
  body: string;
  count: number;
};

export function WorkSection({
  kicker,
  title,
  lede,
  series,
  counts,
  links,
  anchorId = "work",
}: {
  kicker: string;
  title: string;
  lede: string;
  series: readonly SeriesCard[];
  counts: { one: string; many: string; none: string };
  links: readonly { label: string; href: string }[];
  anchorId?: string;
}) {
  return (
    <section className="band" id={anchorId} aria-labelledby="work-heading">
      <div className="wrap split">
        <div>
          <p className="script kicker">{kicker}</p>
          <h2 id="work-heading">{title}</h2>
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
          {series.map((item) => (
            <li key={item.slug}>
              <Link className="point-card" href={`/series/${item.slug}`}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="card-link">
                  {item.count === 0
                    ? counts.none
                    : item.count === 1
                      ? counts.one
                      : counts.many.replace("{n}", String(item.count))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
