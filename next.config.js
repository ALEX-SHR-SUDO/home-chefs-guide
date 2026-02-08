/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: 'output: export' has been removed to support API routes for image migration
  // The migration feature requires server-side Node.js APIs (fs module) which are not
  // available in a static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        // Wildcard hostname pattern allows images from any Vercel Blob subdomain
        // This is necessary because each Vercel Blob store has a unique subdomain
        // If you know your specific subdomain, you can restrict it here for better security
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/recipes/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
