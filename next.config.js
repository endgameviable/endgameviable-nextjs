const fs = require('fs').promises;

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
    async redirects() {
      const data = await getFile('redirects.json');
      return data.map((e) => ({
        source: e.source,
        destination: e.target,
        permanent: true,
      }));
    },
};

// Tricky to get this to work, we can't use Typescript here
async function getFile(filename) {
  const pathname = [
    process.cwd(),
    'content',
    filename
  ].join('/');
  const body = await fs.readFile(pathname, 'utf8');
  return JSON.parse(body);
}

module.exports = nextConfig;
