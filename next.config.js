/** @type {import('next').NextConfig} */
const fs = require('fs').promises;

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
        destination: canonicalize(e.target),
        permanent: true,
      }));
    },
};

// Tricky to get this to work, we can't use Typescript here
// We have functions to do this but don't want to call Typescript
// Trying to keep this entirely self-contained
// See https://nextjs.org/docs/pages/building-your-application/configuring/typescript#type-checking-nextconfigjs

async function getFile(filename) {
  const pathname = [
    process.cwd(),
    'content',
    filename
  ].join('/');
  const body = await fs.readFile(pathname, 'utf8');
  return JSON.parse(body);
}

function canonicalize(path) {
  let s = path;
  if (s.endsWith('/')) s = s.substring(0, s.length - 1);
  if (!s.startsWith('/')) s = '/' + s;
  return s;
}

module.exports = nextConfig;
