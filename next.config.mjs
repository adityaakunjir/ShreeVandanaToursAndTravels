/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { inlineCss: true },
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    qualities: [60, 75],
    deviceSizes: [384, 640, 960, 1280, 1920, 2560],
  },
  async headers() {
    return [
      {
        source: '/assets/responsive/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
