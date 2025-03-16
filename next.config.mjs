/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'sharp': 'commonjs sharp',
      'canvas': 'commonjs canvas'
    });
    return config;
  },
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  }
};

export default nextConfig;
