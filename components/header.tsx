"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { id: string; label: string; href: string };

export function Header({ items }: { items: readonly Item[] }) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link className="logo" href="/">
          K.
          <span className="sr-only"> Kriti Agarwal, home</span>
        </Link>
        <nav className="nav-scroll" aria-label="Pages">
          <ul className="nav-pill">
            {items.map((item) => {
              const current = item.href === "/" ? pathname === "/" : pathname === item.href;
              return (
                <li key={item.id}>
                  <Link href={item.href} aria-current={current ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
