import { CommunitySection } from "@/components/community-section";
import { site } from "@/content/site";
import { getEvents } from "@/lib/events";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("community");

export default async function CommunityPage() {
  const events = await getEvents();

  return (
    <CommunitySection
      kicker={site.community.kicker}
      title={site.community.title}
      lede={site.community.lede}
      events={events.upcoming}
      past={events.past}
      source={events.source}
      fallbackNote={site.community.fallbackNote}
      empty={site.community.empty}
      calendarUrl={site.community.calendarUrl}
      calendarLabel={site.community.calendarLabel}
      saveLabel={site.community.saveLabel}
      pastTitle={site.community.pastTitle}
      pastLink={site.community.pastLink}
    />
  );
}
