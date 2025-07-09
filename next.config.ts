import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  dynamic: 'force-dynamic', // força todas as rotas a serem SSR
}

export default nextConfig
