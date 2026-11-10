import type { Metadata } from "next";
import { Caveat, Fraunces, Outfit } from "next/font/google";
import { site } from "@/content/site";
import { HashScroll } from "@/components/hash-scroll";
import { Header } from "@/components/header";
import { SeasonFall } from "@/components/season-fall";
import { SiteFooter } from "@/components/site-footer";
import { getTokyoWeather } from "@/lib/tokyo-weather";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const metadataBase = new URL(
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Kriti Agarwal",
    template: "%s · Kriti Agarwal",
  },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    title: "Kriti Agarwal",
    description: site.description,
    type: "website",
    locale: "en_US",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const weather = await getTokyoWeather();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <a className="skip" href="#content">
          Skip to content
        </a>
        <HashScroll />
        <Header items={site.nav} mark={site.hero.monogram} weather={weather} />
        <main id="content">{children}</main>
        <SiteFooter
          prompt={site.footer.prompt}
          email={site.email}
          noteHref="/#note"
          links={site.footer.links}
          madeWith={site.footer.madeWith}
        />
        <SeasonFall />
      </body>
    </html>
  );
}
