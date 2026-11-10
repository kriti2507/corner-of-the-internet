import Link from "next/link";
import { External } from "@/components/external";

export function SiteFooter({
  prompt,
  email,
  noteHref,
  links,
  madeWith,
}: {
  prompt: string;
  email: string;
  noteHref: string;
  links: readonly { label: string; href: string }[];
  madeWith: string;
}) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <p className="footer-note">
          <Link className="script footer-prompt" href={noteHref}>
            {prompt}
          </Link>{" "}
          <a className="footer-email" href={`mailto:${email}`}>
            {email}
          </a>
        </p>
        <ul className="footer-links">
          {links.map((link) => (
            <li key={link.href}>
              <External href={link.href}>{link.label}</External>
            </li>
          ))}
        </ul>
        <p className="footer-made">{madeWith}</p>
      </div>
    </footer>
  );
}
