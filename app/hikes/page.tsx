import { Breadcrumbs } from "@/components/breadcrumbs";
import { HikesSection } from "@/components/hikes-section";
import { site } from "@/content/site";
import { getHikes } from "@/lib/hikes";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("hikes");

export default function HikesPage() {
  const hikes = getHikes();

  return (
    <div className="field-band">
      <div className="wrap crumb-wrap">
        <Breadcrumbs items={[{ label: site.weekends.title, href: "/weekends" }, { label: site.hikes.title }]} />
      </div>
      <HikesSection
        hikes={hikes}
        kicker={site.hikes.kicker}
        title={site.hikes.title}
        lede={site.hikes.lede}
        mapLabel={site.hikes.mapLabel}
        approxNote={site.hikes.approxNote}
      />
    </div>
  );
}
