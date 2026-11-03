/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://staypilot.dashboardkiller.online/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
