export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.BASE_PATH
    ? `https://harish876.github.io${process.env.BASE_PATH}`
    : "https://harish876.github.io";
