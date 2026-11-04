"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Item = { id: string; label: string; href: string };

function isPageLink(href: string) {
  return href.startsWith("/") && !href.includes("#");
}

export function Header({ items, mark }: { items: readonly Item[]; mark: string }) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const nodes = items
      .filter((item) => item.href.includes("#"))
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.05, 0.2, 0.45] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items, pathname]);

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <Link className="logo" href="/">
          {mark}
          <span className="sr-only"> home</span>
        </Link>
        <nav className="nav-scroll" aria-label="Site">
          <ul className="nav-pill">
            {items.map((item) => {
              const current = isPageLink(item.href)
                ? pathname === item.href
                : pathname === "/" && active === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={item.id === "note" ? "nav-hi" : undefined}
                    aria-current={current ? "page" : undefined}
                  >
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
