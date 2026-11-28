import type { NextConfig } from "next";

/**
 * The Coffee Notebook (coffee/ folder) is a separate Vercel project. It runs
 * under basePath /coffee, so heykriti.com/coffee/* is passed straight to it
 * and shows up here as if it were part of this site.
 */
const COFFEE_ORIGIN = process.env.COFFEE_ORIGIN ?? "https://kriti-coffee.vercel.app";

/** Cafés and matcha moved from /places to the Coffee Notebook. Old links follow them. */
const COFFEE_PLACE_SLUGS = [
  "hanaju",
  "geshary-coffee-hibiya",
  "shelves-coffee",
  "think-coffee",
  "2d-cafe",
  "uni-coffee-roastery-azabu",
  "arabica-azabudai-hills",
  "iriya-plus-cafe",
  "pop-in",
  "marumi-coffee-odori",
  "standard-coffee-lab",
  "creperie-tsuki",
  "cafe-kanon",
  "miyano-yu",
  "zen-punk-matcha-ginza",
  "chotto-matcha-asakusa",
  "matcha-passport",
  "savor-the-matcha",
  "johnsons-tea-lounge",
];

const nextConfig: NextConfig = {
  /* Old section URLs land on the matching part of the home page. */
  async redirects() {
    return [
      { source: "/work", destination: "/#sakana", permanent: false },
      { source: "/projects", destination: "/#small-wins", permanent: false },
      { source: "/community", destination: "/#community", permanent: false },
      { source: "/consulting", destination: "/#consulting", permanent: false },
      ...COFFEE_PLACE_SLUGS.map((slug) => ({
        source: `/places/${slug}`,
        destination: `/coffee/places/${slug}`,
        permanent: true,
      })),
    ];
  },
  async rewrites() {
    return [
      { source: "/coffee", destination: `${COFFEE_ORIGIN}/coffee` },
      { source: "/coffee/:path+", destination: `${COFFEE_ORIGIN}/coffee/:path+` },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
