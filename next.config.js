/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
   images: {
    loader: "akamai",
    path: "",
  },
  /*basePath: "/demos",
  assetPrefix: "/demos",
  */
};

module.exports = nextConfig;
