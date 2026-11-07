import type { Metadata } from "next";
import { site, type CalendarEvent } from "@/content/site";
import { badgeParts } from "@/lib/format";
import { CommunitySection } from "@/components/community-section";
import { ContactForm } from "@/components/contact-form";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { WeekendsHome } from "@/components/weekends/weekends-home";
import { WorkSection } from "@/components/work-section";
import { WritingSection } from "@/components/writing-section";
import { getEvents } from "@/lib/events";
import { getPosts } from "@/lib/posts";
import { weekendSummary } from "@/lib/weekends";

function badgeFor(event: CalendarEvent | undefined) {
  if (!event) {
    return {
      kicker: site.meetup.kicker,
      month: site.meetup.fallbackMonth,
      day: "",
      year: site.meetup.fallbackYear,
      seats: site.meetup.seatsLabel,
      href: "/#community",
      dated: false,
    };
  }
  const parts = badgeParts(event.start);
  return {
    kicker: site.meetup.kicker,
    month: parts.month,
    day: parts.day,
    year: parts.year,
    seats: site.meetup.seatsLabel,
    href: "/#community",
    dated: true,
  };
}

export const metadata: Metadata = {
  title: { absolute: site.name },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.name,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
};

export default async function Page() {
  const [writing, events] = await Promise.all([getPosts(), getEvents()]);
  const nextMeetup = events.upcoming[0];
  const weekend = weekendSummary();

  return (
    <>
      <div id="top">
        <Hero
          name={site.name}
          greeting={site.hero.greeting}
          monogram={site.hero.monogram}
          lead={site.hero.lead}
          badge={badgeFor(nextMeetup)}
          photos={site.photos}
          polaroids={{
            mountainCaption: site.polaroids.mountain.caption,
            mountainScript: site.polaroids.mountain.script,
            mountainWhere: site.polaroids.mountain.where,
            miraCaption: site.polaroids.mira.caption,
            dragHint: site.polaroids.dragHint,
          }}
          secrets={site.hero.secrets}
          secretFound={site.hero.secretFound}
        />
      </div>
      <div className="home-block home-sakana">
        <span id="work" className="alias-anchor" />
        <WorkSection
          anchorId="sakana"
          kicker={site.work.kicker}
          title={site.work.title}
          lede={site.work.lede}
          points={site.work.points}
          links={site.work.links}
        />
      </div>
      <div className="home-block home-noodle">
        <WritingSection
          kicker={site.writing.kicker}
          title={site.writing.title}
          lede={site.writing.lede}
          posts={writing.posts.slice(0, 3)}
          source={writing.source}
          fallbackNote={site.writing.fallbackNote}
          publicationUrl={site.writing.publicationUrl}
          allLabel={site.writing.allLabel}
          seeAll={{ href: "/writing", label: site.writing.seeAll }}
          heading="h2"
        />
      </div>
      <div className="home-block home-community">
        <CommunitySection
          kicker={site.community.kicker}
          title={site.community.title}
          lede={site.community.lede}
          events={nextMeetup ? [nextMeetup] : []}
          source={events.source}
          fallbackNote={site.community.fallbackNote}
          empty={site.community.empty}
          calendarUrl={site.community.calendarUrl}
          calendarLabel={site.community.calendarLabel}
          saveLabel={site.community.saveLabel}
          pastTitle={site.community.pastTitle}
          pastLink={site.community.pastLink}
        />
      </div>
      <div className="home-block home-weekends">
        <WeekendsHome summary={weekend} />
      </div>
      <div className="home-block home-wins">
        <span id="projects" className="alias-anchor" />
        <ProjectsSection
          anchorId="small-wins"
          kicker={site.projects.kicker}
          title={site.projects.title}
          lede={site.projects.lede}
          url={site.projects.url}
          points={site.projects.points}
          note={site.projects.note}
          cta={site.projects.cta}
        />
      </div>
      <div id="work-with-me" className="home-block">
        <span id="consulting" className="alias-anchor" />
        <span id="note" className="alias-anchor" />
        <ContactForm
          title={site.consulting.title}
          lede={site.consulting.lede}
          aboutCta={site.consulting.aboutCta}
          messageLabel={site.contact.messageLabel}
          submit={site.contact.submit}
          sending={site.contact.sending}
          successTitle={site.contact.successTitle}
          successBody={site.contact.successBody}
          errorFallback={site.contact.errorFallback}
          email={site.email}
        />
      </div>
    </>
  );
}
