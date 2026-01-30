/** @type {import('next').NextConfig} */
const nextConfig = {
  // Esto hará que Vercel ignore los errores de TypeScript y ESLint al compilar
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;