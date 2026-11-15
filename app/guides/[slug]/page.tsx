import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getGuide, guides } from "@/content/guides";
import { postsInGuide } from "@/lib/journal";
import { JsonLd, absolute } from "@/lib/structured-data";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} guide`,
    description: guide.intro,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

/** A guide hub. Sections fill themselves from posts with `guide:` and `section:` frontmatter. */
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const sections = guide.sections
    .map((section) => ({ ...section, posts: postsInGuide(guide.slug, section.id) }))
    .filter((section) => section.posts.length > 0);
  const all = sections.flatMap((section) => section.posts);

  return (
    <section className="band" aria-labelledby="guide-heading">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${guide.title} guide`,
          description: guide.intro,
          url: absolute(`/guides/${guide.slug}`),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: all.map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absolute(`/blog/${post.slug}`),
              name: post.title,
            })),
          },
        }}
      />
      <div className="wrap">
        <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
        <p className="script kicker">a guide</p>
        <h1 id="guide-heading">{guide.title}</h1>
        <p className="lede">{guide.intro}</p>

        {sections.length > 1 ? (
          <ul className="text-links guide-jump">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        ) : null}

        {sections.map((section) => (
          <div key={section.id} className="guide-section" id={section.id}>
            <h2>{section.title}</h2>
            <p className="guide-section-intro">{section.intro}</p>
            {section.posts
              .filter((post) => post.part === 0)
              .map((post) => (
                <Link key={post.slug} className="guide-item guide-lead" href={`/blog/${post.slug}`}>
                  <span className="card-kicker">Start here</span>
                  <span className="guide-item-title">{post.title}</span>
                  {post.summary ? <span className="guide-item-summary">{post.summary}</span> : null}
                </Link>
              ))}
            <ul className="guide-list">
              {section.posts
                .filter((post) => post.part !== 0)
                .map((post) => (
                  <li key={post.slug}>
                    <Link className="guide-item" href={`/blog/${post.slug}`}>
                      <span className="guide-item-title">{post.short ?? post.title}</span>
                      {post.summary ? <span className="guide-item-summary">{post.summary}</span> : null}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
