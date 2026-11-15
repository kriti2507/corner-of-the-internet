import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/content/guides";
import { postsInGuide } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Guides",
  description: "City and region guides from places I've lived and travelled in Japan.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <section className="band" aria-labelledby="guides-heading">
      <div className="wrap">
        <p className="script kicker">around Japan</p>
        <h1 id="guides-heading">Guides</h1>
        <p className="lede">City and region guides, written from places I&apos;ve actually been.</p>
        <ul className="guide-list">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link className="guide-item" href={`/guides/${guide.slug}`}>
                <span className="guide-item-title">{guide.title}</span>
                <span className="guide-item-summary">{guide.intro}</span>
                <span className="card-kicker">{postsInGuide(guide.slug).length} posts</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
