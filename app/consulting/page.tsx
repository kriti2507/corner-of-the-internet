import { ConsultingSection } from "@/components/consulting-section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("consulting");

export default function ConsultingPage() {
  return (
    <ConsultingSection
      kicker={site.consulting.kicker}
      title={site.consulting.title}
      lede={site.consulting.lede}
      services={site.contact.services}
      howTitle={site.consulting.howTitle}
      steps={site.consulting.steps}
      cta={site.consulting.cta}
    />
  );
}
