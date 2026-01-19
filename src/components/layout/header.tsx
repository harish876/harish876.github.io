"use client";

import Logo from "@/assets/logo.svg";
import Image from "next/image";
import NextLink from "next/link";
import { Link } from "../link";

const NAV = [
  { href: "/", label: "Home", external: false },
  { href: "/projects", label: "Projects", external: false },
  { href: "/blog", label: "Blog", external: false },
] as const;

const SOCIALS = [
  { href: "https://github.com/harish876", label: "GitHub", external: true },
  { href: "https://www.linkedin.com/in/harish-gokul01/", label: "LinkedIn", external: true },
] as const;

export const Header = () => {
  return (
    <div className="flex justify-between items-center m-4 mb-2 md:m-10 md:mb-6 dashed-top dashed-bottom h-[72px] md:h-[108px]">
      <NextLink
        href="/"
        className="flex items-center gap-4 dashed-right h-full px-8"
      >
        <Image
          src={Logo}
          alt="HK Logo"
          width={200}
          height={188}
          className="w-auto h-[40px] md:h-[60px] lg:h-[80px]"
        />
      </NextLink>

      {/* Desktop / tablet: original links */}
      <div className="hidden md:flex items-center gap-8 flex-1 justify-end md:flex-none dashed-left before:hidden md:before:block h-full px-10">
        {NAV.map(({ href, label, external }) => (
          <Link
            key={href}
            href={href}
            className="uppercase text-white font-mono text-base md:text-[18px] font-medium"
            {...(external ? { target: "_blank" } : {})}
          >
            {label}
          </Link>
        ))}

        {/* Socials dropdown */}
        <div className="group relative">
          <button className="uppercase text-white font-mono text-base md:text-[18px] font-medium cursor-pointer hover:text-grey transition-colors">
            Socials
          </button>
          <nav className="absolute right-0 mt-3 w-48 rounded-xl border border-white/20 bg-black/90 backdrop-blur p-2 shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <ul className="flex flex-col">
              {SOCIALS.map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="block w-full px-3 py-2 rounded-lg uppercase text-white font-mono text-sm hover:bg-white/10 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile: pure-CSS hamburger (no JS, anchor tags only) */}
      <div className="md:hidden relative flex-1 justify-end dashed-left h-full px-6 flex items-center">
        <details className="group relative">
          <summary
            className="list-none flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {/* hamburger icon */}
            <div className="relative w-5 h-3.5">
              <span className="absolute inset-x-0 top-0 h-0.5 bg-white transition-transform duration-200 group-open:translate-y-1.5 group-open:rotate-45"></span>
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white transition-opacity duration-200 group-open:opacity-0"></span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transition-transform duration-200 group-open:-translate-y-1.5 group-open:-rotate-45"></span>
            </div>
          </summary>

          {/* dropdown panel */}
          <nav className="absolute right-0 mt-3 w-48 rounded-xl border border-white/20 bg-black/90 backdrop-blur p-2 shadow-lg z-51">
            <ul className="flex flex-col">
              {NAV.map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="block w-full px-3 py-2 rounded-lg uppercase text-white font-mono text-sm hover:bg-white/10"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="border-t border-white/10 my-1"></li>
              {SOCIALS.map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="block w-full px-3 py-2 rounded-lg uppercase text-white font-mono text-sm hover:bg-white/10"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </div>
  );
};
