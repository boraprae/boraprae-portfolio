import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev badge defaults to bottom-left, exactly on top of the teaser's
  // sound button. Only visible in development; it does not ship.
  devIndicators: { position: "top-right" },
};

export default nextConfig;
