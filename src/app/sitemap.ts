import { getAllPosts } from "@/lib/blog";
import { baseUrl } from "@/lib/constants";
import type { MetadataRoute } from "next";

// Required for static export
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slugAsParams}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
