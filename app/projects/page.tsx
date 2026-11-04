import { ProjectsSection } from "@/components/projects-section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/page-meta";

export const metadata = pageMetadata("projects");

export default function ProjectsPage() {
  return (
    <ProjectsSection
      kicker={site.projects.kicker}
      title={site.projects.title}
      lede={site.projects.lede}
      url={site.projects.url}
      points={site.projects.points}
      note={site.projects.note}
      cta={site.projects.cta}
      others={site.projects.others}
    />
  );
}
