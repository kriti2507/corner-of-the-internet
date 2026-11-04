import Image from "next/image";
import { Lora } from "next/font/google";
import { External } from "@/components/external";
import { TimeCapsule } from "@/components/time-capsule";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata = pageMetadata("smallWins");

function Cta({ label }: { label: string }) {
  return (
    <External className="btn btn-clay" href={site.smallWins.url}>
      {label}
    </External>
  );
}

export default function SmallWinsPage() {
  const page = site.smallWins;

  return (
    <div className={`sw ${lora.variable}`}>
      <section className="sw-hero" aria-labelledby="sw-heading">
        <div className="wrap sw-hero-grid">
          <div>
            <p className="script kicker">{page.kicker}</p>
            <h1 id="sw-heading">{page.title}</h1>
            <p className="sw-pitch">{page.pitch}</p>
            <p className="lede">{page.lede}</p>
            <div className="hero-actions">
              <Cta label={page.tryLabel} />
            </div>
            <p className="sw-privacy">{page.privacy}</p>
          </div>
          <TimeCapsule ranges={page.ranges} note={page.sampleNote} />
        </div>
      </section>

      {page.features.map((feature, index) => (
        <section className="band" key={feature.title} aria-labelledby={`sw-feature-${index}`}>
          <div className={`wrap sw-feature${"wide" in feature && feature.wide ? " sw-wide" : ""}${index % 2 === 1 ? " sw-flip" : ""}`}>
            <div>
              <p className="script kicker">{feature.kicker}</p>
              <h2 id={`sw-feature-${index}`}>{feature.title}</h2>
              <p className="lede">{feature.body}</p>
            </div>
            <figure className="sw-frame">
              <Image
                src={feature.image}
                alt={feature.alt}
                width={feature.width}
                height={feature.height}
                sizes={
                  "wide" in feature && feature.wide
                    ? "(min-width: 900px) 720px, 92vw"
                    : "(min-width: 900px) 380px, 92vw"
                }
                style={{ width: "100%", height: "auto" }}
                priority={index === 0}
              />
            </figure>
          </div>
        </section>
      ))}

      <section className="band sw-soft" aria-labelledby="sw-phone">
        <div className="wrap sw-feature sw-flip">
          <div>
            <p className="script kicker">{page.phone.kicker}</p>
            <h2 id="sw-phone">{page.phone.title}</h2>
            <p className="lede">{page.phone.body}</p>
          </div>
          <figure className="sw-frame sw-phone">
            <Image
              src={page.phone.image}
              alt={page.phone.alt}
              width={page.phone.width}
              height={page.phone.height}
              sizes="(min-width: 900px) 280px, 70vw"
              style={{ width: "100%", height: "auto" }}
            />
          </figure>
        </div>
      </section>

      <section className="band band-tight" aria-labelledby="sw-chat">
        <div className="wrap sw-chat">
          <p className="script kicker">{page.chat.kicker}</p>
          <h2 id="sw-chat">{page.chat.title}</h2>
          <p className="lede">{page.chat.body}</p>
        </div>
      </section>

      <section className="band" aria-labelledby="sw-faq">
        <div className="wrap">
          <h2 id="sw-faq">{page.faqTitle}</h2>
          <div className="sw-faqs">
            {page.faq.map((item) => (
              <details key={item.q} className="sw-faq">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="sw-close" aria-labelledby="sw-close-heading">
        <div className="wrap">
          <p className="script kicker">{page.closingKicker}</p>
          <h2 id="sw-close-heading">{page.closingTitle}</h2>
          <p className="lede">{page.closingLede}</p>
          <Cta label={page.startLabel} />
        </div>
      </section>
    </div>
  );
}
