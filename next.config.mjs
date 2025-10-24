/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "imagedelivery.net",
      },
      {
        hostname: "img.freepik.com",
      },
    ],
  },
};

export default nextConfig;
