import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/kraik";
const nextConfig: NextConfig = {
  basePath: basePath === "" ? "" : basePath,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  async rewrites() {
    const apiRewrite = { source: "/api/:path*", destination: `${apiUrl}/api/:path*` };
    const kraikApiRewrite = {
      source: "/kraik/api/:path*",
      destination: `${apiUrl}/api/:path*`,
    };
    return [apiRewrite, kraikApiRewrite];
  },
  async redirects() {
    return [
      {
        source: '/curated-itineraries/wild-safari',
        destination: '/curated-itineraries/nature-trails',
        permanent: true,
      },
      {
        source: '/curated-itineraries/wild-safari/:path*',
        destination: '/curated-itineraries/nature-trails/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
