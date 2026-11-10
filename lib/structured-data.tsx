import { site } from "@/content/site";

/**
 * schema.org data for search engines and answer engines (Google, ChatGPT,
 * Perplexity, Claude). It describes who wrote the page and what it is about,
 * so an answer can cite it. Nothing here is visible on the page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output; "<" is escaped so the text can't close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const personId = `${site.url}/#person`;

/** Kriti, linked to her other profiles so engines treat them as one person. */
export const personData = {
  "@type": "Person",
  "@id": personId,
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  description: site.description,
  homeLocation: { "@type": "Place", name: "Tokyo, Japan" },
  worksFor: { "@type": "Organization", name: "Sakana AI", url: "https://sakana.ai" },
  sameAs: site.footer.links.map((link) => link.href),
};

export const siteData = {
  "@context": "https://schema.org",
  "@graph": [
    personData,
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
  ],
};

export function absolute(path: string) {
  return new URL(path, site.url).toString();
}
