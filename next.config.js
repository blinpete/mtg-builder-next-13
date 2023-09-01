const WebpackQRCodePlugin = require("webpack-dev-server-qr-code")

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

  // webpack: (config, options) => {
  //   config.devServer = {
  //     port: 3000,
  //     host: "0.0.0.0",
  //   }

  //   config.plugins = [...(config.plugins || []), new WebpackQRCodePlugin({ size: "small" })]
  //   return config
  // },
}

module.exports = nextConfig
