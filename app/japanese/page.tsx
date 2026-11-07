import type { Metadata } from "next";
import Link from "next/link";
import "@/app/weekends.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/content/site";
import { japanese, weekends } from "@/content/weekends";

const description = "Where Kriti's Japanese is: JLPT N2 passed, N1 next. How she studies, and words from her weekends.";

export const metadata: Metadata = {
  title: "Japanese",
  description,
  alternates: { canonical: "/japanese" },
  openGraph: { title: `Japanese · ${site.name}`, description, url: "/japanese", siteName: site.name, type: "website", locale: "en_US" },
};

export default function JapanesePage() {
  return (
    <section className="band wk-scope" data-lane="japanese" aria-labelledby="japanese-heading">
      <div className="wrap">
        <Breadcrumbs items={[{ label: weekends.title, href: "/weekends" }, { label: japanese.title }]} />
        <div className="wk-head">
          <p className="script kicker">{japanese.kicker}</p>
          <h1 id="japanese-heading">
            {japanese.title} <span lang="ja" className="wk-muted" style={{ fontSize: "0.6em" }}>日本語</span>
          </h1>
          <p className="lede">{japanese.lede}</p>
        </div>

        <div className="wk-jp-top">
          <article className="wk-card wk-jp-level" aria-labelledby="level-heading">
            <p className="wk-lane-name" id="level-heading">
              JLPT
            </p>
            <div className="wk-jp-now">
              <div>
                <span className="wk-num">{japanese.current}</span>
                <span>{japanese.currentNote}</span>
              </div>
              <div>
                <span className="wk-num" style={{ opacity: 0.45 }}>
                  {japanese.next}
                </span>
                <span>{japanese.nextNote}</span>
              </div>
            </div>
            <ol className="wk-ladder" aria-label="JLPT levels, easiest first">
              {japanese.levels.map((level) => (
                <li key={level.id} data-status={level.status}>
                  <b>{level.id}</b>
                  {level.id === japanese.current ? japanese.currentNote : level.status === "done" ? "✓" : level.status === "next" ? "next" : ""}
                </li>
              ))}
            </ol>
            {japanese.status.map((line) => (
              <p key={line} style={{ margin: 0 }}>
                {line}
              </p>
            ))}
          </article>

          <article className="wk-card wk-jp-study" aria-labelledby="study-heading">
            <h2 id="study-heading">{japanese.studyTitle}</h2>
            <ul>
              {japanese.study.map((item) => (
                <li key={item.title}>
                  <b>{item.title}</b>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="wk-head" style={{ marginBottom: "1rem" }}>
          <h2 className="subhead" style={{ margin: 0 }}>
            {japanese.wordsTitle}
          </h2>
          <p className="lede">{japanese.wordsLede}</p>
        </div>
        <ul className="wk-words">
          {japanese.words.map((word) => {
            const lane = weekends.lanes[word.lane];
            return (
              <li key={word.ja}>
                <article className="wk-card wk-wordcard" data-lane={word.lane}>
                  <span className="wk-word-ja" lang="ja">
                    {word.ja}
                  </span>
                  <span className="wk-kana">
                    <span lang="ja">{word.kana}</span> · {word.romaji}
                  </span>
                  <span className="wk-en">{word.en}</span>
                  <Link className="wk-pill" href={lane.href}>
                    {lane.label}
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
