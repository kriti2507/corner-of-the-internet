"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export type ShelfItem = { slug: string; kind: string; kindLabel: string; tags: string[]; rating?: number; price?: number; date?: string; name: string };

type Sort = "newest" | "rating" | "price";

/**
 * Filters for the shelf. The cards themselves are rendered on the server and
 * passed in by slug, so this only decides which to show and in what order.
 */
export function ShelfBrowser({ items, cards, kinds }: { items: ShelfItem[]; cards: Record<string, React.ReactNode>; kinds: { id: string; label: string }[] }) {
  const params = useSearchParams();
  const [kind, setKind] = useState<string>(params.get("kind") ?? "all");
  const [tag, setTag] = useState<string>(params.get("tag") ?? "");
  const [sort, setSort] = useState<Sort>("newest");

  const tags = useMemo(() => [...new Set(items.flatMap((item) => item.tags))].sort(), [items]);

  const shown = useMemo(() => {
    const list = items.filter((item) => (kind === "all" || item.kind === kind) && (!tag || item.tags.includes(tag)));
    return [...list].sort((a, b) => {
      if (sort === "rating") return (b.rating ?? -1) - (a.rating ?? -1);
      if (sort === "price") return (a.price ?? Infinity) - (b.price ?? Infinity);
      return (b.date ?? "").localeCompare(a.date ?? "");
    });
  }, [items, kind, tag, sort]);

  const present = kinds.filter((k) => items.some((item) => item.kind === k.id));

  return (
    <>
      <div className="filters">
        <div className="filter-group" role="group" aria-label="Kind of coffee">
          <span>Show</span>
          <button className="filter-btn" aria-pressed={kind === "all"} onClick={() => setKind("all")}>
            Everything
          </button>
          {present.map((k) => (
            <button key={k.id} className="filter-btn" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
              {k.label}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <label htmlFor="shelf-tag">
            <span>Tag</span>
          </label>
          <select id="shelf-tag" className="filter-select" value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">Any tag</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t.replace(/-/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="shelf-sort">
            <span>Sort by</span>
          </label>
          <select id="shelf-sort" className="filter-select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="newest">Newest first</option>
            <option value="rating">Highest rated</option>
            <option value="price">Cheapest first</option>
          </select>
        </div>
      </div>
      <p className="sr-only" role="status">
        Showing {shown.length} of {items.length} coffees
      </p>
      {shown.length ? (
        <ul className="shelf-grid">
          {shown.map((item) => (
            <li key={item.slug}>{cards[item.slug]}</li>
          ))}
        </ul>
      ) : (
        <p className="empty">Nothing on the shelf matches that. Try another tag.</p>
      )}
    </>
  );
}
