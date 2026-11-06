import { Breadcrumbs } from "@/components/breadcrumbs";
import { CoffeeSection } from "@/components/coffee-section";
import { getCafes } from "@/content/cafes";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("coffee");

export default function CoffeePage() {
  const places = getCafes().map((cafe) => ({
    slug: cafe.slug,
    name: cafe.name,
    area: cafe.neighbourhood,
    neighbourhood: cafe.neighbourhood,
    note: cafe.note,
    tags: cafe.tags,
    placeholder: cafe.placeholder,
  }));

  return (
    <>
    <div className="wrap crumb-wrap">
      <Breadcrumbs items={[{ label: site.weekends.title, href: "/weekends" }, { label: "Coffee" }]} />
    </div>
    <CoffeeSection
      kicker={site.coffee.kicker}
      title={site.coffee.title}
      lede={site.coffee.lede}
      places={places}
      ticketKicker={site.coffee.ticketKicker}
      interestsKicker={site.coffee.interestsKicker}
      interestsTitle={site.coffee.interestsTitle}
      interestsLede={site.coffee.interestsLede}
      interests={site.coffee.interests}
      allLabel={site.coffee.allLabel}
      tagLabel={site.coffee.tagLabel}
      areaLabel={site.coffee.areaLabel}
      pageLink={site.coffee.pageLink}
    />
    </>
  );
}
