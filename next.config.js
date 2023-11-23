/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'media.endgameviable.com',
            port: '',
            pathname: '/img/**',
          },
        ],
    },    
};

module.exports = nextConfig;
