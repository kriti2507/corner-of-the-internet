"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The contact form lives at /#note. A client navigation from another page
 * scrolls before the home page's fonts have settled, so the note lands
 * too low. Wait for fonts, then scroll once more.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const scroll = () => {
      if (cancelled) return;
      const hash = window.location.hash;
      if (!hash) return;
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    };

    const later = (delay: number) => {
      timers.push(window.setTimeout(scroll, delay));
    };

    scroll();
    later(50);
    document.fonts?.ready.then(() => {
      scroll();
      later(120);
    });
    window.addEventListener("hashchange", scroll);
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("hashchange", scroll);
    };
  }, [pathname]);

  return null;
}
