import { HeroASCII } from "@/components/hero";
import { getPageBySlug } from "@/lib/pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harish Krishnakumar | Systems, Databases And Observability Engineer",
  applicationName: "Harish Portfolio",
  description:
    "Systems, Databases, and Observability Engineer. Currently pursuing Master's in CS at UC Davis. Working on Apache ResilientDB ecosystem and benchmarking web servers. Passionate about databases, systems programming, and creating meaningful digital experiences.",
  openGraph: {
    title: "Harish Krishnakumar | Systems, Databases And Observability Engineer",
    description:
      "Systems, Databases, and Observability Engineer. Currently pursuing Master's in CS at UC Davis. Working on Apache ResilientDB ecosystem and benchmarking web servers.",
    siteName: "Harish Krishnakumar",
    url: "https://harish876.github.io",
    type: "website",
    locale: "en_US"
  },
  alternates: {
    canonical: "https://harish876.github.io"
  }
};

export default function Home() {
  const page = getPageBySlug("home");
  return (
    <div className="h-full w-full relative overflow-hidden">
      <HeroASCII pageBody={page?.body} />
    </div>
  );
}
