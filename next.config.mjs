import { withPlausibleProxy } from "next-plausible";

// Start Velite automatically with Next.js (only for build, not dev)
// In dev mode, use the separate velite:watch script via npm run dev
const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && isBuild) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: false, clean: true });
}

// Check if we're building for GitHub Pages
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGitHubPages && process.env.BASE_PATH ? process.env.BASE_PATH : '';

const nextConfig = withPlausibleProxy()({
  output: 'export',
  // Only set basePath if it's not empty (Next.js handles empty string differently)
  ...(basePath && { basePath }),
  images: {
    unoptimized: true
  },
  // Remove async headers and redirects for static export
  // GitHub Pages doesn't support Next.js headers/redirects
});

export default nextConfig;
