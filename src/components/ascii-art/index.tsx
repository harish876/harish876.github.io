"use client";
import { getBasePath } from "@/lib/constants";
import { useEffect, useState } from "react";

interface ASCIIArtProps {
    className?: string;
}

export const ASCIIArt = ({ className = "" }: ASCIIArtProps) => {
    const [asciiContent, setAsciiContent] = useState<string>("");

    useEffect(() => {
        const basePath = getBasePath();
        fetch(`${basePath}/ascii-art.txt`)
            .then((res) => res.text())
            .then((text) => setAsciiContent(text))
            .catch((err) => console.error("Failed to load ASCII art:", err));
    }, []);

    if (!asciiContent) return null;

    return (
        <div className={className}>
            <pre className="text-white font-mono text-[4px] md:text-[5px] lg:text-[6px] leading-none opacity-80 hover:opacity-100 transition-opacity">
                {asciiContent}
            </pre>
        </div>
    );
};
