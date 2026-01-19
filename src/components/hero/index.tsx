"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ASCIIArt } from "../ascii-art";

export const HeroASCII = () => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/content/home.mdx")
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load content:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full overflow-clip h-[calc(100dvh-96px)] md:h-[calc(100dvh-208px)] lg:h-[calc(100dvh-332px)] relative">
      <div className="w-full h-full px-4 md:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full lg:items-center max-w-7xl mx-auto">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-start space-y-6 pt-8 pb-8 md:pt-12 md:pb-12 lg:justify-center lg:py-0 h-full">
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-funnel font-light text-white mb-4">
                Harish Krishnakumar
              </h1>
              <p className="text-grey font-mono text-base md:text-lg">
                Systems | Databases | Observability
              </p>
            </div>

            <div className="prose prose-invert prose-grey max-w-none">
              {loading ? (
                <div className="text-grey font-sans text-sm md:text-base">
                  Loading...
                </div>
              ) : content ? (
                <div className="text-grey font-sans text-sm md:text-base leading-relaxed">
                  <ReactMarkdown
                    components={{
                      a: ({ node, href, children, ...props }) => {
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
                      p: ({ node, children, ...props }) => (
                        <p className="mb-4" {...props}>
                          {children}
                        </p>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-grey font-sans text-sm md:text-base">
                  Content not found
                </div>
              )}
            </div>
          </div>

          {/* Right side - ASCII Art (hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center lg:justify-end h-full m-8">
            <ASCIIArt className="w-full max-w-md lg:max-w-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
