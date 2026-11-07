import Image from "next/image";
import { Lora } from "next/font/google";
import { External } from "@/components/external";
import { StarterDemo } from "@/components/starter-demo";
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

/** The Quick Add box right after a clear win is saved, worded as in the app. */
function QuickAddMock() {
  return (
    <figure className="sw-frame qa-mock">
      <div className="qa-row" aria-hidden="true">
        <span className="qa-input">ran 5k in 27 min</span>
        <span className="qa-btn">Add</span>
      </div>
      <p className="qa-logged">
        Logged to Workout · <u>Undo</u> · <u>View</u>
      </p>
      <div className="qa-lane" aria-hidden="true">
        <span className="qa-lane-name">🏃 Workout · Duration (min)</span>
        <span className="qa-boxes">
          {[-1, 1, 2, -1, 0, 3, -1, 2, 1, -1, 3, 4].map((shade, i) => (
            <i key={i} className={shade < 0 ? undefined : `g${shade}`} />
          ))}
        </span>
      </div>
      <figcaption>A clear win saves straight away. The newest square is today.</figcaption>
    </figure>
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
          <StarterDemo />
        </div>
      </section>

      <section className="band band-tight" aria-labelledby="sw-flow">
        <div className="wrap">
          <h2 id="sw-flow">{page.flowTitle}</h2>
          <ol className="wins-steps wins-steps-row">
            {page.flow.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {page.features.map((feature, index) => {
        const wide = "wide" in feature && feature.wide;
        return (
          <section className="band" key={feature.title} aria-labelledby={`sw-feature-${index}`}>
            <div className={`wrap sw-feature${wide ? " sw-wide" : ""}${index % 2 === 1 ? " sw-flip" : ""}`}>
              <div>
                <p className="script kicker">{feature.kicker}</p>
                <h2 id={`sw-feature-${index}`}>{feature.title}</h2>
                <p className="lede">{feature.body}</p>
              </div>
              {"mock" in feature ? (
                <QuickAddMock />
              ) : (
                <figure className="sw-frame">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    width={feature.width}
                    height={feature.height}
                    sizes={wide ? "(min-width: 900px) 720px, 92vw" : "(min-width: 900px) 380px, 92vw"}
                    style={{ width: "100%", height: "auto" }}
                  />
                </figure>
              )}
            </div>
          </section>
        );
      })}

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
