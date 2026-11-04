import Link from "next/link";
import type { HeroRole } from "@/content/site";
import { PolaroidStage } from "@/components/polaroids";

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
  roles,
  badge,
  photos,
  polaroids,
  secrets,
  secretFound,
}: {
  name: string;
  greeting: string;
  monogram: string;
  roles: readonly HeroRole[];
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
        <ul className="hero-roles">
          {roles.map((role) => {
            const className = `mark mark-${role.mark}`;
            const external = role.href.startsWith("http");
            return (
              <li key={role.href}>
                {external ? (
                  <a className={className} href={role.href} target="_blank" rel="noreferrer">
                    {role.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link className={className} href={role.href}>
                    {role.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
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
    </section>
  );
}
