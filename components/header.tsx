"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Item = { id: string; label: string; href: string };

function hashId(href: string) {
  const index = href.indexOf("#");
  return index >= 0 ? href.slice(index + 1) : null;
}

/**
 * The observer only reports entries that changed. Choosing among that
 * batch leaves the highlight stuck on the previous section. The callback
 * re-reads every section and keeps the last one whose top has crossed
 * the bottom of the sticky header.
 */
export function Header({ items, mark }: { items: readonly Item[]; mark: string }) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const sectionKey = items.map((item) => `${item.id}:${item.href}`).join("|");

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = sectionKey
      .split("|")
      .map((part) => {
        const [id, href] = part.split(":");
        return hashId(href ?? "") ? id : null;
      })
      .filter((id): id is string => Boolean(id));

    let frame = 0;
    const pick = () => {
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
      const line = Math.max(header + 24, Math.min(window.innerHeight * 0.33, header + 180));
      let current: string | null = null;
      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= line) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    const observer = new IntersectionObserver(schedule, {
      root: null,
      rootMargin: "-10% 0px -45% 0px",
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });
    nodes.forEach((node) => observer.observe(node));
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("hashchange", schedule);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname, sectionKey]);

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
              const onHome = pathname === "/";
              const pageMatch =
                (item.id === "writing" && pathname === "/writing") ||
                (item.id === "small-wins" && pathname === "/small-wins") ||
                (item.id === "weekends" &&
                  (pathname === "/weekends" ||
                    pathname.startsWith("/hikes") ||
                    pathname.startsWith("/coffee") ||
                    pathname.startsWith("/books")));
              const current = pageMatch || (onHome && active === item.id);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={item.id === "work-with-me" ? "nav-hi" : undefined}
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
