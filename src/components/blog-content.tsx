"use client";
import { getBasePath } from "@/lib/constants";
import { MDXRenderer } from "@/components/MDXRenderer";

interface BlogContentProps {
  code: string;
}

export const BlogContent = ({ code }: BlogContentProps) => {
  const basePath = getBasePath();

  return (
    <MDXRenderer
      code={code}
      components={{
        img: ({ src, alt, ...props }: any) => {
          const imageSrc = src?.startsWith("/") ? `${basePath}${src}` : src;
          return (
            <img
              src={imageSrc}
              alt={alt}
              className="rounded-lg my-4"
              {...props}
            />
          );
        },
      }}
    />
  );
};
