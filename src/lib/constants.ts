/**
 * Get the base path for the application.
 * Works on both server and client side.
 * On server: uses process.env.BASE_PATH
 * On client: uses process.env.NEXT_PUBLIC_BASE_PATH
 */
export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_BASE_PATH
    return process.env.NEXT_PUBLIC_BASE_PATH || '';
  }
  // Server-side: use BASE_PATH
  return process.env.BASE_PATH || '';
}

export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.BASE_PATH
    ? `https://harish876.github.io${process.env.BASE_PATH}`
    : "https://harish876.github.io";
