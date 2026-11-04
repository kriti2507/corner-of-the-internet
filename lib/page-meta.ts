import type { Metadata } from "next";
import { site } from "@/content/site";

type PageKey = keyof typeof site.pages;

export function pageMetadata(key: PageKey): Metadata {
  const page = site.pages[key];
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: `${page.title} · ${site.name}`,
      description: page.description,
      url: page.path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
  };
}
