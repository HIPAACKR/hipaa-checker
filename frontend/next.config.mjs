/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
        'img.icons8.com',
        'images.unsplash.com',
        'randomuser.me'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/user-account/:path*',
        has: [
          {
            type: 'cookie',
            key: 'isLoggedIn',
            value: 'false',
          },
        ],
        destination: '/sign-in?redirect=/user-account/:path*',
        permanent: false,
      },
      {
        source: '/sign-in',
        has: [
          {
            type: 'cookie',
            key: 'isLoggedIn',
            value: 'true',
          },
        ],
        destination: '/user-account/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
