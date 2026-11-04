import Link from "next/link";
import type { LeadPart } from "@/content/site";
import { PolaroidStage } from "@/components/polaroids";

type Action = { label: string; href: string; variant: "ink" | "ghost" | "yellow" };

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
  actions,
  badge,
  photos,
  polaroids,
}: {
  name: string;
  greeting: string;
  monogram: string;
  lead: readonly LeadPart[];
  actions: readonly Action[];
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
}) {
  return (
    <section className="hero wrap" aria-labelledby="intro-heading">
      <div className="hero-copy">
        <p className="script greeting">{greeting}</p>
        <p className="monogram" aria-hidden="true">
          {monogram}
        </p>
        <h1 id="intro-heading" className="sr-only">
          {name}
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
        <div className="hero-actions">
          {actions.map((action) => (
            <Link key={action.label} className={`btn btn-${action.variant}`} href={action.href}>
              {action.label}
            </Link>
          ))}
        </div>
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
      />
    </section>
  );
}
