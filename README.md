# Portfolio Website

Personal portfolio website built with Next.js, TypeScript, and TailwindCSS.

## Development

```bash
npm install
npm run dev
```

## Building for GitHub Pages

The site is configured for static export and can be deployed to GitHub Pages.

### Setup Instructions

1. **If your repository is `username.github.io`** (user/organization page):
   - The `BASE_PATH` in `.github/workflows/deploy.yml` should be empty: `BASE_PATH: ""`
   - Your site will be available at `https://username.github.io`

2. **If your repository is a project page** (e.g., `username.github.io/portfoliov2`):
   - Update `BASE_PATH` in `.github/workflows/deploy.yml` to your repo name: `BASE_PATH: "/portfoliov2"`
   - Your site will be available at `https://username.github.io/portfoliov2`

3. **Enable GitHub Pages in your repository**:
   - Go to Settings → Pages
   - Under "Source", select "GitHub Actions"

4. **Push to main branch**:
   - The GitHub Actions workflow will automatically build and deploy your site

## Manual Build

To build locally:

```bash
npm run velite
GITHUB_PAGES=true BASE_PATH="" npm run build
```

The static files will be in the `out/` directory.
