"use client";
import Link from "next/link";
import { MDXRenderer } from "./MDXRenderer";

interface ProjectsContentProps {
  body: string;
}

export function ProjectsContent({ body }: ProjectsContentProps) {
  return (
    <div className="text-grey font-sans text-base leading-relaxed">
      <MDXRenderer 
        code={body}
        components={{
          a: ({ node, href, children, ...props }: any) => {
            const isExternal = href?.startsWith("http") || href?.startsWith("mailto:");
            if (isExternal) {
              return (
                <a
                  href={href}
                  className="text-spiral-light-blue hover:text-spiral-washed-light-blue underline transition-colors"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  {...props}
                >
                  {children}
                </a>
              );
            }
            return (
              <Link
                href={href || "#"}
                className="text-spiral-light-blue hover:text-spiral-washed-light-blue underline transition-colors"
                {...props}
              >
                {children}
              </Link>
            );
          },
        }}
      />
    </div>
  );
}
