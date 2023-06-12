/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ['svgs.scryfall.io'],
  },
}

module.exports = nextConfig
