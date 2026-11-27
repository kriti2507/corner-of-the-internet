import type { NextConfig } from "next";

/**
 * The Coffee Notebook (coffee/ folder) is a separate Vercel project. It runs
 * under basePath /coffee, so heykriti.com/coffee/* is passed straight to it
 * and shows up here as if it were part of this site.
 */
const COFFEE_ORIGIN = process.env.COFFEE_ORIGIN ?? "https://kriti-coffee.vercel.app";

const nextConfig: NextConfig = {
  /* Old section URLs land on the matching part of the home page. */
  async redirects() {
    return [
      { source: "/work", destination: "/#sakana", permanent: false },
      { source: "/projects", destination: "/#small-wins", permanent: false },
      { source: "/community", destination: "/#community", permanent: false },
      { source: "/consulting", destination: "/#consulting", permanent: false },
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
