import type { Metadata } from "next";
import { getGuides } from "@/lib/content";
import { Crumbs, GuideCard } from "@/components/bits";

export const metadata: Metadata = {
  title: "Guides",
  description: "Kriti's short lists: the best drip bags at Kaldi, Tokyo cafés to work from, and more.",
  alternates: { canonical: "/coffee/guides" },
};

export default function GuidesPage() {
  const guides = getGuides();
  return (
    <div className="wrap">
      <header className="page-head">
        <Crumbs items={[{ label: "Guides" }]} />
        <span className="ja-tag" lang="ja">
          おすすめ
        </span>
        <h1>Guides</h1>
        <p>Ranked short lists. Each pick links to its own page with the tasting notes, price and a map.</p>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="boards">
          {guides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>
    </div>
  );
}
