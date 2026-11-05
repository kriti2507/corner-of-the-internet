import Link from "next/link";
import type { Book } from "@/lib/books";

const SPINES: { bg: string; fg: string }[] = [
  { bg: "#1c2744", fg: "#f3eee3" },
  { bg: "#6d3140", fg: "#f3eee3" },
  { bg: "#efd15f", fg: "#1c2744" },
  { bg: "#c5d7ea", fg: "#1c2744" },
  { bg: "#f4c9c4", fg: "#1c2744" },
  { bg: "#c9d5b0", fg: "#1c2744" },
  { bg: "#3d4a66", fg: "#f3eee3" },
  { bg: "#f0c9a8", fg: "#1c2744" },
  { bg: "#8a6232", fg: "#f3eee3" },
  { bg: "#2f5d50", fg: "#f3eee3" },
  { bg: "#d7c4e2", fg: "#1c2744" },
  { bg: "#e07a62", fg: "#1c2744" },
];

export function Bookshelf({ books }: { books: readonly Book[] }) {
  return (
    <ul className="shelf">
      {books.map((item, index) => {
        const spine = SPINES[index % SPINES.length];
        const height = 128 + (item.title.length % 5) * 14;
        return (
          <li key={item.slug}>
            <Link
              className="spine"
              href={`/books/${item.slug}`}
              aria-label={`${item.title} by ${item.author}`}
              style={{ background: spine.bg, color: spine.fg, height }}
            >
              <span>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
