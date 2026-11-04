import { site, type CalendarEvent } from "@/content/site";
import { badgeParts } from "@/lib/format";
import { AboutSection } from "@/components/about-section";
import { Bookshelf } from "@/components/bookshelf";
import { CafesSection } from "@/components/cafes-section";
import { CommunitySection } from "@/components/community-section";
import { ContactForm } from "@/components/contact-form";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HikesSection } from "@/components/hikes-section";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
import { UpTo } from "@/components/up-to";
import { WorkSection } from "@/components/work-section";
import { WritingSection } from "@/components/writing-section";
import { getBooks } from "@/lib/books";
import { getEvents } from "@/lib/events";
import { getHikes } from "@/lib/hikes";
import { getPosts } from "@/lib/posts";

function badgeFor(event: CalendarEvent | undefined) {
  if (!event) {
    return {
      kicker: site.meetup.kicker,
      month: site.meetup.fallbackMonth,
      day: "",
      year: site.meetup.fallbackYear,
      seats: site.meetup.seatsLabel,
      href: "#community",
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
    href: "#community",
    dated: true,
  };
}

export default async function Page() {
  const [writing, events] = await Promise.all([getPosts(), getEvents()]);
  const hikes = getHikes();
  const books = getBooks();

  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <Header items={site.nav.map((item) => ({ ...item }))} />
      <main id="content">
        <div id="top">
          <Hero
            name={site.name}
            greeting={site.hero.greeting}
            monogram={site.hero.monogram}
            lead={[...site.hero.lead]}
            actions={site.hero.actions.map((action) => ({ ...action }))}
            badge={badgeFor(events.upcoming[0])}
            photos={{ ...site.photos }}
            polaroids={{
              mountainCaption: site.polaroids.mountain.caption,
              mountainScript: site.polaroids.mountain.script,
              mountainWhere: site.polaroids.mountain.where,
              miraCaption: site.polaroids.mira.caption,
              dragHint: site.polaroids.dragHint,
            }}
          />
        </div>
        <UpTo title={site.upTo.title} aside={site.upTo.aside} cards={site.upTo.cards.map((card) => ({ ...card }))} />
        <WorkSection {...site.work} points={site.work.points.map((point) => ({ ...point }))} links={site.work.links.map((link) => ({ ...link }))} />
        <WritingSection
          kicker={site.writing.kicker}
          title={site.writing.title}
          lede={site.writing.lede}
          posts={writing.posts}
          source={writing.source}
          fallbackNote={site.writing.fallbackNote}
          publicationUrl={site.writing.publicationUrl}
          allLabel={site.writing.allLabel}
        />
        <ProjectsSection
          kicker={site.projects.kicker}
          title={site.projects.title}
          lede={site.projects.lede}
          url={site.projects.url}
          points={site.projects.points}
          note={site.projects.note}
          cta={{ ...site.projects.cta }}
        />
        <CommunitySection
          kicker={site.community.kicker}
          title={site.community.title}
          lede={site.community.lede}
          events={events.upcoming}
          source={events.source}
          fallbackNote={site.community.fallbackNote}
          empty={site.community.empty}
          calendarUrl={site.community.calendarUrl}
          calendarLabel={site.community.calendarLabel}
          saveLabel={site.community.saveLabel}
        />
        <div className="field-band">
          <HikesSection
            hikes={hikes}
            kicker={site.hikes.kicker}
            title={site.hikes.title}
            lede={site.hikes.lede}
            mapLabel={site.hikes.mapLabel}
            approxNote={site.hikes.approxNote}
          />
          <Bookshelf
            books={books}
            kicker={site.books.kicker}
            title={site.books.title}
            lede={site.books.lede}
            readLabel={site.books.readLabel}
          />
          <CafesSection
            kicker={site.cafes.kicker}
            title={site.cafes.title}
            lede={site.cafes.lede}
            places={site.cafes.places.map((place) => ({ ...place }))}
          />
        </div>
        <AboutSection
          kicker={site.about.kicker}
          title={site.about.title}
          paragraphs={site.about.paragraphs}
          facts={site.about.facts}
        />
        <ContactForm
          kicker={site.contact.kicker}
          title={site.contact.title}
          lede={site.contact.lede}
          services={site.contact.services.map((service) => ({ ...service }))}
          topics={site.contact.topics.map((topic) => ({ ...topic }))}
          submit={site.contact.submit}
          sending={site.contact.sending}
          successTitle={site.contact.successTitle}
          successBody={site.contact.successBody}
          errorFallback={site.contact.errorFallback}
          email={site.email}
        />
      </main>
      <SiteFooter
        prompt={site.footer.prompt}
        email={site.email}
        noteHref="#note"
        links={site.footer.links.map((link) => ({ ...link }))}
      />
    </>
  );
}
