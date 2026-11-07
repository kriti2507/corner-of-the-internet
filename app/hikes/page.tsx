import "@/app/weekends.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { HikeLog } from "@/components/weekends/hike-log";
import { weekends } from "@/content/weekends";
import { getHikes } from "@/lib/hikes";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("hikes");

export default function HikesPage() {
  const hikes = getHikes();
  const regions = new Set(hikes.map((hike) => hike.region)).size;

  return (
    <section className="band wk-scope" data-lane="hikes" aria-labelledby="hikes-heading">
      <div className="wrap">
        <Breadcrumbs items={[{ label: weekends.title, href: "/weekends" }, { label: weekends.lanes.hikes.label }]} />
        <div className="wk-head">
          <p className="script kicker">field notes</p>
          <h1 id="hikes-heading">Hikes</h1>
          <p className="lede">
            Every hike from the log across {regions} prefectures, mostly Hokkaido and the ridges around Tokyo.
          </p>
        </div>
        <HikeLog hikes={hikes} />
      </div>
    </section>
  );
}
