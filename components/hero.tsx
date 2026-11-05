import type { LeadPart } from "@/content/site";
import { PolaroidStage } from "@/components/polaroids";
import { TokyoSkyline } from "@/components/tokyo-skyline";

type Badge = {
  kicker: string;
  month: string;
  day: string;
  year: string;
  seats: string;
  href: string;
  dated: boolean;
};

export function Hero({
  name,
  greeting,
  monogram,
  lead,
  badge,
  photos,
  polaroids,
  secrets,
  secretFound,
}: {
  name: string;
  greeting: string;
  monogram: string;
  lead: readonly LeadPart[];
  badge: Badge;
  photos: {
    mountain: string | null;
    mountainAlt: string;
    mira: string | null;
    miraAlt: string;
  };
  polaroids: {
    mountainCaption: string;
    mountainScript: string;
    mountainWhere: string;
    miraCaption: string;
    dragHint: string;
  };
  secrets: readonly {
    title: string;
    body: string;
    cta?: { label: string; href: string };
  }[];
  secretFound: string;
}) {
  return (
    <section className="hero wrap" aria-labelledby="intro-heading">
      <div className="hero-copy">
        <p className="script greeting">{greeting}</p>
        <h1 id="intro-heading" className="monogram">
          {monogram}
          <span className="sr-only"> {name}</span>
        </h1>
        <p className="hero-lead">
          {lead.map((part, index) =>
            part.mark ? (
              <mark key={index} className={`mark mark-${part.mark}`}>
                {part.text}
              </mark>
            ) : (
              <span key={index}>{part.text}</span>
            ),
          )}
        </p>
      </div>
      <PolaroidStage
        badge={badge}
        mountainSrc={photos.mountain}
        mountainAlt={photos.mountainAlt}
        miraSrc={photos.mira}
        miraAlt={photos.miraAlt}
        mountainCaption={polaroids.mountainCaption}
        mountainScript={polaroids.mountainScript}
        mountainWhere={polaroids.mountainWhere}
        miraCaption={polaroids.miraCaption}
        dragHint={polaroids.dragHint}
        resetLabel="Put the photos back"
        secrets={secrets}
        secretFound={secretFound}
      />
      <TokyoSkyline />
    </section>
  );
}
