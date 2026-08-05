/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure the /prompts/*.md files (loaded via fs at runtime by
  // src/lib/ai/prompts.ts) are bundled into every API route's serverless
  // function output on Vercel.
  experimental: {
    outputFileTracingIncludes: {
      // /prompts/*.md is loaded via fs at runtime by src/lib/ai/prompts.ts.
      // node_modules/pdf-parse/**/* covers pdfjs-dist's pdf.worker.mjs, which
      // it loads dynamically at runtime (not a static import Next's file
      // tracer can see) — without this the worker file is missing from the
      // deployed function and pdf-parse throws "Setting up fake worker
      // failed: Cannot find module '.../pdf.worker.mjs'" on every PDF upload.
      '/api/**/*': ['./prompts/**/*', './node_modules/pdf-parse/**/*'],
    },
    // pdf-parse bundles pdfjs-dist's ESM build, which webpack mis-bundles for
    // the server runtime (throws "Object.defineProperty called on non-object"
    // at module-load time). Keep it external so Node requires it natively.
    serverComponentsExternalPackages: ['pdf-parse'],
  },
}

module.exports = nextConfig
