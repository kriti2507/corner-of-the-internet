"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string; href: string };

export function Header({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = items
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
  }, [items]);

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a className="logo" href="#top">
          K.
          <span className="sr-only"> Kriti Agarwal, back to top</span>
        </a>
        <nav className="nav-scroll" aria-label="Sections">
          <ul className="nav-pill">
            {items.map((item) => (
              <li key={item.id}>
                <a href={item.href} aria-current={active === item.id ? "true" : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
