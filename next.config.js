/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://apps.apple.com/app/6742452533",
        permanent: false,
      },
      {
        source: "/RootNavView/:path*",
        destination: "https://apps.apple.com/app/6742452533",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
