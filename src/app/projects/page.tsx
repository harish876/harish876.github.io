"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ProjectsPage() {
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/content/projects.mdx")
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
        <div className="h-full w-full bg-background text-white">
            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-funnel font-light text-white mb-4">
                        Projects
                    </h1>
                    <p className="text-grey font-mono text-lg">
                        My work and side projects
                    </p>
                </div>

                <div className="prose prose-invert prose-grey max-w-none">
                    {loading ? (
                        <div className="text-grey font-sans text-base">
                            Loading...
                        </div>
                    ) : content ? (
                        <div className="text-grey font-sans text-base leading-relaxed">
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
                                    h1: ({ node, children, ...props }) => (
                                        <h1 className="text-3xl md:text-4xl font-funnel font-light text-white mb-6 mt-8" {...props}>
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ node, children, ...props }) => (
                                        <h2 className="text-2xl md:text-3xl font-sans font-medium text-white mb-4 mt-6" {...props}>
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ node, children, ...props }) => (
                                        <h3 className="text-xl md:text-2xl font-sans font-medium text-white mb-3 mt-4" {...props}>
                                            {children}
                                        </h3>
                                    ),
                                    ul: ({ node, children, ...props }) => (
                                        <ul className="list-disc list-inside mb-4 space-y-2" {...props}>
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ node, children, ...props }) => (
                                        <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ node, children, ...props }) => (
                                        <li className="text-grey" {...props}>
                                            {children}
                                        </li>
                                    ),
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="text-grey font-sans text-base">
                            Content not found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
