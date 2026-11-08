import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        // Vercel redirected the apex to www at the domain level; off Vercel the
        // app does it. Both hosts point at this service.
        source: "/:path*",
        has: [{ type: "host", value: "reformnv.org" }],
        destination: "https://www.reformnv.org/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // The deployment's *.vercel.app and *.ivyup.io hostnames serve the same
        // pages as www.reformnv.org; keep them out of search results.
        source: "/:path*",
        has: [{ type: "host", value: "(.*)\\.(vercel\\.app|ivyup\\.io)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
