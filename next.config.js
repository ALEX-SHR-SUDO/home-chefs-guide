/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
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
