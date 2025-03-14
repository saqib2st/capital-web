/** @type {import('next').NextConfig} */
const nextConfig = {
          async redirects() {
            return [
              {
                source: "/RootNavView/:path*",
                destination: "/[slug]?slug=:path*",
                permanent: false,
              },
            ];
          },
        };
        
        module.exports = nextConfig;
        