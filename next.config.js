/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'github.com', 'placekitten.com'],
  },
}

module.exports = nextConfig

