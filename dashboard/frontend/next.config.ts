import type { NextConfig } from "next";

// When building for GitHub Pages, the site is served from a sub-path
// (https://<user>.github.io/Job_Scraper/), so assets need a base path.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
