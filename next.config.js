/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure the /prompts/*.md files (loaded via fs at runtime by
  // src/lib/ai/prompts.ts) are bundled into every API route's serverless
  // function output on Vercel.
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prompts/**/*'],
    },
  },
}

module.exports = nextConfig
