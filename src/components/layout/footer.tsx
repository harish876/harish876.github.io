
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="flex flex-col m-4 mb-2 md:m-10">
      <div className="flex flex-col sm:flex-row justify-center items-center px-4 sm:px-0 gap-4 md:gap-16 dashed-top dashed-bottom after:hidden md:after:block py-4 md:py-0 md:h-[84px]">
        <div className="flex items-center h-full lg:px-10">
          <span className="text-white font-mono text-sm items-center gap-1 text-center sm:text-left">
            Powered by © Harish Krishnakumar 2026 | Design inspired by{" "}
            <Link
              href="https://vortex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-spiral-light-blue hover:text-spiral-washed-light-blue underline transition-colors"
            >
              Vortex
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
