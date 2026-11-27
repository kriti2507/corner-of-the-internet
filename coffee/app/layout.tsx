import type { Metadata, Viewport } from "next";
import "@fontsource/shippori-mincho-b1/500.css";
import "@fontsource/shippori-mincho-b1/700.css";
import "@fontsource/shippori-mincho-b1/800.css";
import "@fontsource/zen-kaku-gothic-new/400.css";
import "@fontsource/zen-kaku-gothic-new/500.css";
import "@fontsource/zen-kaku-gothic-new/700.css";
import "@fontsource/caveat/500.css";
import "./globals.css";
import { SITE } from "@/lib/content";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  metadataBase: new URL("https://heykriti.com"),
  title: { default: `${SITE.name} · Kriti Agarwal`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  authors: [{ name: SITE.owner, url: SITE.home }],
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: "/coffee",
    siteName: "Kriti Agarwal",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/coffee" },
};

export const viewport: Viewport = { themeColor: "#2a1a12" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <Header />
        <main id="content">{children}</main>
        <footer className="foot">
          <div className="wrap foot-row">
            <p className="foot-hand">Drunk, paid for and written up by Kriti in Tokyo.</p>
            <nav aria-label="Elsewhere">
              <a href={SITE.home}>heykriti.com</a>
              <a href={`${SITE.home}/places`}>All my places in Japan</a>
              <a href={`${SITE.home}/#note`}>Say hello</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
