import Link from "next/link";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  const page = site.aboutPage;

  return (
    <section className="band" aria-labelledby="about-page-heading">
      <div className="wrap">
        <p className="script kicker">{page.kicker}</p>
        <h1 id="about-page-heading">{page.title}</h1>
        <p className="lede">{page.lede}</p>
        <ol className="timeline">
          {page.timeline.map((item) => (
            <li key={item.title} className={item.placeholder ? "is-placeholder" : undefined}>
              <article className="timeline-card">
                {item.placeholder ? <span className="tape tape-yellow placeholder-tape">TODO</span> : null}
                <p className="card-kicker">{item.when}</p>
                <h2 className="ticket-title">{item.title}</h2>
                <p>{item.body}</p>
                {item.href && item.link ? (
                  <p>
                    <Link className="card-link" href={item.href}>
                      {item.link}
                    </Link>
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
