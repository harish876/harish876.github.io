import { withPlausibleProxy } from "next-plausible";

// Start Velite automatically with Next.js (recommended approach)
const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: isDev, clean: !isDev });
}

// Check if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGitHubPages && process.env.BASE_PATH ? process.env.BASE_PATH : '';

const nextConfig = withPlausibleProxy()({
  output: 'export',
  basePath: basePath,
  images: {
    unoptimized: true
  },
  // Remove async headers and redirects for static export
  // GitHub Pages doesn't support Next.js headers/redirects
});

export default nextConfig;
