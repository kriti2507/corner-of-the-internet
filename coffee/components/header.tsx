"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/shelf", label: "The shelf", match: (p: string) => p === "/shelf" },
  { href: "/places", label: "Cafés & shops", match: (p: string) => p.startsWith("/places") },
  { href: "/guides", label: "Guides", match: (p: string) => p.startsWith("/guides") },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="top">
      <div className="wrap top-row">
        {/* Kriti's site mark, same as the heykriti.com header. Different app, so a plain link. */}
        <a className="top-home" href="https://heykriti.com">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M3.5 11.2 12 4l8.5 7.2M6 9.6V20h4.4v-5.2h3.2V20H18V9.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M10.4 20v-5.2h3.2V20" fill="#efd15f" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          Kriti
          <span className="sr-only">, back to heykriti.com</span>
        </a>
        <span className="top-sep" aria-hidden="true">
          /
        </span>
        <Link href="/" className="top-mark" aria-label="The Coffee Notebook, home">
          <span className="top-ja" aria-hidden="true">
            珈琲帳
          </span>
          <span className="top-en">The Coffee Notebook</span>
        </Link>
        <nav aria-label="Coffee notebook">
          <ul className="top-nav">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={item.match(pathname) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
