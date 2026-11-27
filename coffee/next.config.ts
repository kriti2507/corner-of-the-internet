import type { NextConfig } from "next";

/**
 * This app is a "zone" of heykriti.com. It lives under /coffee so the main
 * site can rewrite heykriti.com/coffee/* straight to it (see the main site's
 * next.config.ts). Every page, asset and API route sits under /coffee.
 */
const nextConfig: NextConfig = {
  basePath: "/coffee",
  async redirects() {
    return [
      // The bare vercel.app domain lands on the notebook.
      { source: "/", destination: "/coffee", basePath: false, permanent: false },
      // Old placeholder café slugs from the main site.
      { source: "/example-:rest", destination: "/places", permanent: true },
    ];
  },
};

export default nextConfig;
