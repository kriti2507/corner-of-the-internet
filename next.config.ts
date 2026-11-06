import type { NextConfig } from "next";

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
