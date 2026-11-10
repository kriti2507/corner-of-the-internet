"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Phone browsers (iOS Chrome and Safari especially) restore an old scroll
 * position when a tab is reopened, so the site can open halfway down.
 * A fresh visit without a #hash should always start at the top; back and
 * forward keep the browser's own restore.
 */
function startAtTop() {
  if (window.location.hash) return;
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (nav?.type === "back_forward") return;
  window.scrollTo(0, 0);
}

/**
 * The contact form lives at /#note. A client navigation from another page
 * scrolls before the home page's fonts have settled, so the note lands
 * too low. Wait for fonts, then scroll once more.
 */
export function HashScroll() {
  const pathname = usePathname();

  // Runs once per full page load, not on client-side navigation.
  useEffect(() => {
    startAtTop();
    const timer = window.setTimeout(startAtTop, 60);
    const onShow = (event: PageTransitionEvent) => {
      if (event.persisted) return;
      startAtTop();
    };
    window.addEventListener("pageshow", onShow);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pageshow", onShow);
    };
  }, []);

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
