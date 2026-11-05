import Link from "next/link";
import { Goshuin, HikeName } from "@/components/hike-mark";
import type { Book } from "@/lib/books";
import type { Cafe } from "@/content/cafes";
import type { Hike } from "@/lib/hikes";
import { formatDay } from "@/lib/format";

export function WeekendsTeaser({
  kicker,
  title,
  lede,
  seeAll,
  hike,
  book,
  cafe,
  hikeLink,
  bookLink,
  cafeLink,
}: {
  kicker: string;
  title: string;
  lede: string;
  seeAll: string;
  hike: Hike | null;
  book: Book | null;
  cafe: Cafe | null;
  hikeLink: string;
  bookLink: string;
  cafeLink: string;
}) {
  return (
    <section className="band" id="weekends" aria-labelledby="weekends-heading">
      <div className="wrap">
        <p className="script kicker">{kicker}</p>
        <div className="section-head">
          <h2 id="weekends-heading">{title}</h2>
          <Link className="text-link" href="/weekends">
            {seeAll}
          </Link>
        </div>
        <p className="lede">{lede}</p>
        <ul className="weekend-grid">
          {hike ? (
            <li>
              <Link className="sticker tone-blue" data-tilt="1" href="/hikes">
                <p className="card-kicker">{hike.region}</p>
                <h3>
                  <HikeName title={hike.title} />
                </h3>
                <Goshuin />
                <p className="card-body">
                  <time dateTime={hike.date}>{formatDay(hike.date)}</time>
                </p>
                <span className="card-link">{hikeLink}</span>
              </Link>
            </li>
          ) : null}
          {book ? (
            <li>
              <Link className="sticker tone-pink" data-tilt="2" href="/books">
                <p className="card-kicker">{book.author}</p>
                <h3>{book.title}</h3>
                <p className="card-body">
                  <time dateTime={book.date}>{formatDay(book.date)}</time>
                </p>
                <span className="card-link">{bookLink}</span>
              </Link>
            </li>
          ) : null}
          {cafe ? (
            <li>
              <Link className="sticker tone-peach" data-tilt="3" href="/coffee">
                <span className="noren" aria-hidden="true">
                  <span />
                  <span />
                </span>
                {cafe.placeholder ? <span className="tape tape-yellow placeholder-tape">Placeholder</span> : null}
                <p className="card-kicker">{cafe.neighbourhood}</p>
                <h3>{cafe.name}</h3>
                <p className="card-body">{cafe.note}</p>
                <span className="card-link">{cafeLink}</span>
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
