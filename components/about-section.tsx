export function AboutSection({
  kicker,
  title,
  paragraphs,
  facts,
}: {
  kicker: string;
  title: string;
  paragraphs: readonly string[];
  facts: readonly string[];
}) {
  return (
    <section className="band" id="about" aria-labelledby="about-heading">
      <div className="wrap about-layout">
        <div>
          <p className="script kicker">{kicker}</p>
          <h2 id="about-heading">{title}</h2>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="lede">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="fact-list">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
