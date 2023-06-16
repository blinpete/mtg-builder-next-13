/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'svgs.scryfall.io',
      'cards.scryfall.io',
    ],
  },
  // experimental: {turbo: {}},
}

module.exports = nextConfig
