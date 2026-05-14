// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.euroleaguebasketball.net" },
      { protocol: "https", hostname: "live.euroleague.net" },
    ],
  },
};

module.exports = nextConfig;
