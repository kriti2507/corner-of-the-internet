import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page-head" style={{ minHeight: "50vh" }}>
      <span className="ja-tag" lang="ja">
        売り切れ
      </span>
      <h1>That one&apos;s not on the shelf</h1>
      <p>The page may have moved, or the coffee was never logged.</p>
      <p style={{ marginTop: "1.4rem" }}>
        <Link className="more" href="/shelf">
          Browse the shelf
        </Link>
      </p>
    </div>
  );
}
