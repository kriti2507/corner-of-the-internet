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
        {/* Different zone, so a plain link and a full page load. */}
        <a className="top-home" href="https://heykriti.com">
          <span aria-hidden="true">←</span> heykriti
        </a>
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
