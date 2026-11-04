import { External } from "@/components/external";

export function SiteFooter({
  prompt,
  email,
  noteHref,
  links,
}: {
  prompt: string;
  email: string;
  noteHref: string;
  links: { label: string; href: string }[];
}) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <a className="script footer-prompt" href={noteHref}>
            {prompt}
          </a>
          <a className="footer-email" href={`mailto:${email}`}>
            [{email}]
          </a>
        </div>
        <ul className="footer-links">
          {links.map((link) => (
            <li key={link.href}>
              <External href={link.href}>{link.label}</External>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
