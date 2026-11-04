import { WorkSection } from "@/components/work-section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("work");

export default function WorkPage() {
  return (
    <WorkSection
      kicker={site.work.kicker}
      title={site.work.title}
      lede={site.work.lede}
      points={site.work.points}
      links={site.work.links}
    />
  );
}
