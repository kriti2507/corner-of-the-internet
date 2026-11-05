import { hikeKanji } from "@/lib/hike-kanji";

export function Goshuin({ className = "goshuin" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke="#8f3d3d" strokeWidth="2" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke="#8f3d3d" strokeWidth="1" />
      <text x="24" y="30" textAnchor="middle" fill="#8f3d3d" fontSize="16" fontFamily="Georgia, serif">
        登
      </text>
    </svg>
  );
}

export function HikeName({ title }: { title: string }) {
  const kanji = hikeKanji[title];
  return (
    <>
      {title}
      {kanji ? (
        <span className="hike-kanji" lang="ja">
          {" "}
          {kanji}
        </span>
      ) : null}
    </>
  );
}
