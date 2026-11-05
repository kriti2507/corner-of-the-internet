import Link from "next/link";
import { site } from "@/content/site";
import { MatchaLeaf } from "@/components/season-accent";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("weekends");

export default function WeekendsPage() {
  const page = site.weekends;

  return (
    <section className="band" aria-labelledby="weekends-hub-heading">
      <div className="wrap">
        <p className="script kicker">{page.kicker}</p>
        <h1 id="weekends-hub-heading">{page.title}</h1>
        <p className="lede">{page.lede}</p>
        <ul className="weekend-grid">
          {page.categories.map((category) => (
            <li key={category.id}>
              {category.available && category.href ? (
                <Link className="sticker tone-yellow" data-tilt="2" href={category.href}>
                  <p className="card-kicker">{page.kicker}</p>
                  <h3>{category.title}</h3>
                  <p className="card-body">{category.body}</p>
                  <span className="card-link">Open →</span>
                </Link>
              ) : (
                <article className={`sticker tone-peach${category.id === "matcha" ? " matcha-card" : ""}`} data-tilt="3">
                  <span className="tape tape-yellow placeholder-tape">{page.comingSoon}</span>
                  {category.id === "matcha" ? <MatchaLeaf /> : null}
                  <h3>{category.title}</h3>
                  <p className="card-body">{category.body}</p>
                </article>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
