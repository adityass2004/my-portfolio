/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  // NOTE: no rewrites — /api/* is served by Next.js route handlers in app/api/*.
  // (An old rewrite to http://localhost:3001 broke /api/github, /api/leetcode
  // and /api/portfolio whenever the express server wasn't running, and the
  // express server doesn't even implement /api/github or /api/leetcode.)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;