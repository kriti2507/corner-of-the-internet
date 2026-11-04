"use client";

import Link from "next/link";
import { useState } from "react";

type Place = { name: string; area: string; note: string };

type Interest = {
  kicker: string;
  tone: "blue" | "pink" | "yellow" | "green" | "peach";
  tilt: string;
  title: string;
  body: string;
  href?: string;
  link?: string;
};

function Cup() {
  return (
    <svg className="cup" viewBox="0 0 72 56" aria-hidden="true">
      <path
        d="M10 14h40v22a16 16 0 0 1-16 16H26A16 16 0 0 1 10 36Z"
        fill="#fffdf8"
        stroke="#1c2744"
        strokeWidth="2.4"
      />
      <path d="M50 20h8a8 8 0 0 1 0 16h-8" fill="none" stroke="#1c2744" strokeWidth="2.4" />
      <path d="M22 8c2 3 2 3 0 6M32 6c2 3 2 3 0 6M42 8c2 3 2 3 0 6" fill="none" stroke="#1c2744" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CoffeeSection({
  kicker,
  title,
  lede,
  places,
  ticketKicker,
  interestsKicker,
  interestsTitle,
  interestsLede,
  interests,
}: {
  kicker: string;
  title: string;
  lede: string;
  places: readonly Place[];
  ticketKicker: string;
  interestsKicker: string;
  interestsTitle: string;
  interestsLede: string;
  interests: readonly Interest[];
}) {
  const [selected, setSelected] = useState(0);
  const place = places[selected] ?? places[0];

  return (
    <div className="coffee-band">
      <section className="band" aria-labelledby="coffee-heading">
        <div className="wrap">
          <p className="script kicker">{kicker}</p>
          <h1 id="coffee-heading">{title}</h1>
          <p className="lede">{lede}</p>
          <div className="coffee-layout">
            {place ? (
              <article className="sticker tone-peach ticket" data-tilt="2" aria-live="polite">
                <span className="tape tape-yellow placeholder-tape">Placeholder</span>
                <Cup />
                <p className="script kicker">{ticketKicker}</p>
                <h2 className="ticket-title">{place.name}</h2>
                <p className="cafe-area">{place.area}</p>
                <p>{place.note}</p>
              </article>
            ) : null}
            <ul className="cafe-grid">
              {places.map((item, index) => (
                <li key={`${item.area}-${index}`}>
                  <button
                    type="button"
                    className="cafe-card"
                    aria-pressed={index === selected}
                    onClick={() => setSelected(index)}
                  >
                    <span className="tape tape-yellow placeholder-tape">Placeholder</span>
                    <h3>{item.name}</h3>
                    <p className="cafe-area">{item.area}</p>
                    <p>{item.note}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="band band-tight" aria-labelledby="interests-heading">
        <div className="wrap">
          <p className="script kicker">{interestsKicker}</p>
          <h2 id="interests-heading">{interestsTitle}</h2>
          <p className="lede">{interestsLede}</p>
          <ul className="interest-grid">
            {interests.map((item) => (
              <li key={item.title}>
                {item.href ? (
                  <Link className={`sticker tone-${item.tone}`} data-tilt={item.tilt} href={item.href}>
                    <p className="card-kicker">{item.kicker}</p>
                    <h3>{item.title}</h3>
                    <p className="card-body">{item.body}</p>
                    {item.link ? <span className="card-link">{item.link}</span> : null}
                  </Link>
                ) : (
                  <article className={`sticker tone-${item.tone}`} data-tilt={item.tilt}>
                    <p className="card-kicker">{item.kicker}</p>
                    <h3>{item.title}</h3>
                    <p className="card-body">{item.body}</p>
                  </article>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function CoffeeTeaser({
  kicker,
  title,
  lede,
  seeAll,
  place,
}: {
  kicker: string;
  title: string;
  lede: string;
  seeAll: string;
  place: Place | undefined;
}) {
  return (
    <section className="band" id="coffee" aria-labelledby="coffee-teaser-heading">
      <div className="wrap coffee-teaser">
        <div>
          <p className="script kicker">{kicker}</p>
          <h2 id="coffee-teaser-heading">{title}</h2>
          <p className="lede">{lede}</p>
          <Link className="text-link" href="/coffee">
            {seeAll}
          </Link>
        </div>
        {place ? (
          <article className="cafe-card">
            <span className="tape tape-yellow placeholder-tape">Placeholder</span>
            <h3>{place.name}</h3>
            <p className="cafe-area">{place.area}</p>
            <p>{place.note}</p>
          </article>
        ) : null}
      </div>
    </section>
  );
}
