import { HeroASCIINotFound } from "@/components/hero-404";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | Page not found",
  applicationName: "Harish Krishnakumar",
  description: "404 | Page not found",
  openGraph: {
    title: "404 | Page not found",
    description: "404 | Page not found",
    siteName: "Harish Krishnakumar",
    url: "https://harish876.github.io",
    type: "website",
    locale: "en_US"
  },
  alternates: {
    canonical: "https://harish876.github.io"
  }
};

export default function NotFound() {
  return (
    <div className="h-full w-full relative">
      <HeroASCIINotFound />
    </div>
  );
}
