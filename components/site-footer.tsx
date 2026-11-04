import Link from "next/link";
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
  links: readonly { label: string; href: string }[];
}) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="script footer-prompt" href={noteHref}>
            {prompt}
          </Link>
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
