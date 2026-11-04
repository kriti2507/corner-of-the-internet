export function CafesSection({
  kicker,
  title,
  lede,
  places,
}: {
  kicker: string;
  title: string;
  lede: string;
  places: { name: string; area: string; note: string }[];
}) {
  return (
    <section className="band band-tight" id="cafes" aria-labelledby="cafes-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <h2 id="cafes-heading">{title}</h2>
        <p className="lede">{lede}</p>
        <ul className="cafe-grid">
          {places.map((place, index) => (
            <li key={`${place.area}-${index}`} className="cafe-card">
              <span className="tape tape-yellow placeholder-tape">Placeholder</span>
              <h3>{place.name}</h3>
              <p className="cafe-area">{place.area}</p>
              <p>{place.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
