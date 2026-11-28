import type { NextConfig } from "next";

/**
 * This app is a "zone" of heykriti.com. It lives under /coffee so the main
 * site can rewrite heykriti.com/coffee/* straight to it (see the main site's
 * next.config.ts). Every page, asset and API route sits under /coffee.
 */
const nextConfig: NextConfig = {
  basePath: "/coffee",
  async redirects() {
    // coffee.heykriti.com is a short link: everything on it goes to the same
    // page under heykriti.com/coffee, which stays the one real address.
    // (heykriti.com/coffee reaches this app via kriti-coffee.vercel.app, so
    // these never match on the way in and can't loop.)
    const short = [{ type: "host" as const, value: "coffee.heykriti.com" }];
    return [
      { source: "/", has: short, destination: "https://heykriti.com/coffee", basePath: false, permanent: true },
      { source: "/coffee", has: short, destination: "https://heykriti.com/coffee", basePath: false, permanent: true },
      { source: "/coffee/:path+", has: short, destination: "https://heykriti.com/coffee/:path+", basePath: false, permanent: true },
      { source: "/:path+", has: short, destination: "https://heykriti.com/coffee/:path+", basePath: false, permanent: true },
      // The bare vercel.app domain lands on the notebook.
      { source: "/", destination: "/coffee", basePath: false, permanent: false },
      // Old placeholder café slugs from the main site.
      { source: "/example-:rest", destination: "/places", permanent: true },
    ];
  },
};

export default nextConfig;
