/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Fix monorepo root inference + reduce watch scope
    root: __dirname,
  },
};
module.exports = nextConfig;
