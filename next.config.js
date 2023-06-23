/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["svgs.scryfall.io", "cards.scryfall.io"],
  },
  experimental: {
    // turbo: {},
    // typedRoutes: true,
  },
}

module.exports = nextConfig
