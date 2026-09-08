/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // La home (/) sert la vitrine pro, sans afficher /pro dans l'URL.
        // /pro reste accessible directement.
        { source: '/', destination: '/pro' },
      ],
    }
  },
};

export default nextConfig;