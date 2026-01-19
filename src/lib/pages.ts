import { pages } from '#site/content';

export type Page = (typeof pages)[number];

export function getPageBySlug(slug: string): Page | null {
  // Fallback if pages collection hasn't been generated yet
  if (!pages || pages.length === 0) {
    return null;
  }
  const page = pages.find((page) => page.slugAsParams === slug);
  return page || null;
}

export function getAllPages(): Page[] {
  return pages || [];
}
