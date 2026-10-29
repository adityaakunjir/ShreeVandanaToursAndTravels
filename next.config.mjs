/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [60, 75],
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920],
  },
  async headers() {
    return [
      {
        source: '/assets/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
