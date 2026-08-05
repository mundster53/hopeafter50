/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure the /prompts/*.md files (loaded via fs at runtime by
  // src/lib/ai/prompts.ts) are bundled into every API route's serverless
  // function output on Vercel.
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./prompts/**/*'],
    },
    // pdf-parse bundles pdfjs-dist's ESM build, which webpack mis-bundles for
    // the server runtime (throws "Object.defineProperty called on non-object"
    // at module-load time). Keep it external so Node requires it natively.
    serverComponentsExternalPackages: ['pdf-parse'],
  },
}

module.exports = nextConfig
