import type { Metadata } from "next";
import { site, type CalendarEvent } from "@/content/site";
import { badgeParts } from "@/lib/format";
import { ContactForm } from "@/components/contact-form";
import { Hero } from "@/components/hero";
import { UpTo } from "@/components/up-to";
import { getEvents } from "@/lib/events";

function badgeFor(event: CalendarEvent | undefined) {
  if (!event) {
    return {
      kicker: site.meetup.kicker,
      month: site.meetup.fallbackMonth,
      day: "",
      year: site.meetup.fallbackYear,
      seats: site.meetup.seatsLabel,
      href: "/community",
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
    href: "/community",
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
  const events = await getEvents();

  return (
    <>
      <div id="top">
        <Hero
          name={site.name}
          greeting={site.hero.greeting}
          monogram={site.hero.monogram}
          lead={site.hero.lead}
          actions={site.hero.actions}
          badge={badgeFor(events.upcoming[0])}
          photos={site.photos}
          polaroids={{
            mountainCaption: site.polaroids.mountain.caption,
            mountainScript: site.polaroids.mountain.script,
            mountainWhere: site.polaroids.mountain.where,
            miraCaption: site.polaroids.mira.caption,
            dragHint: site.polaroids.dragHint,
          }}
        />
      </div>
      <UpTo title={site.upTo.title} aside={site.upTo.aside} cards={site.upTo.cards} />
      <ContactForm
        kicker={site.contact.kicker}
        title={site.contact.title}
        lede={site.contact.lede}
        services={site.contact.services}
        topics={site.contact.topics}
        submit={site.contact.submit}
        sending={site.contact.sending}
        successTitle={site.contact.successTitle}
        successBody={site.contact.successBody}
        errorFallback={site.contact.errorFallback}
        email={site.email}
      />
    </>
  );
}
