export function UpTo({
  title,
  aside,
  cards,
}: {
  title: string;
  aside: string;
  cards: {
    index: string;
    kicker: string;
    tone: "blue" | "pink" | "yellow" | "green" | "peach";
    tilt: string;
    title: string;
    body: string;
    href: string;
    link: string;
  }[];
}) {
  return (
    <section className="band" aria-labelledby="upto-heading">
      <div className="wrap">
        <h2 id="upto-heading" className="section-title">
          {title} <span className="script aside">{aside}</span>
        </h2>
        <div className="up-grid">
          {cards.map((card) => (
            <a
              key={card.index}
              className={`sticker tone-${card.tone}`}
              data-tilt={card.tilt}
              href={card.href}
            >
              <p className="card-kicker">
                {card.index} · {card.kicker}
              </p>
              <h3>{card.title}</h3>
              <p className="card-body">{card.body}</p>
              <span className="card-link">{card.link}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
