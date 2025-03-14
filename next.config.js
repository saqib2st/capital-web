/** @type {import('next').NextConfig} */
const nextConfig = {
          async rewrites() {
            return [
              {
                source: "/RootNavView/:path*",
                destination: "/[slug]?slug=:path*",
              },
            ];
          },
          async redirects() {
            return [
              {
                source: "/",
                destination: "/",
                permanent: false,
              },
            ];
          },
        };
        
        module.exports = nextConfig;
        