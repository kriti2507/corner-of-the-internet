import { CoffeeSection } from "@/components/coffee-section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("coffee");

export default function CoffeePage() {
  return (
    <CoffeeSection
      kicker={site.coffee.kicker}
      title={site.coffee.title}
      lede={site.coffee.lede}
      places={site.cafes.places}
      ticketKicker={site.coffee.ticketKicker}
      interestsKicker={site.coffee.interestsKicker}
      interestsTitle={site.coffee.interestsTitle}
      interestsLede={site.coffee.interestsLede}
      interests={site.coffee.interests}
    />
  );
}
