import { permanentRedirect } from "next/navigation";

/** The three topic pages are gone; every Sakana App note now lives on /sakana. */
export function generateStaticParams() {
  return ["memory", "mcp", "tools"].map((slug) => ({ slug }));
}

export default function SeriesPage() {
  permanentRedirect("/sakana");
}
