import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getBasePath } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import { Funnel_Display, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const funnelDisplay = Funnel_Display({
  weight: ["300"],
  variable: "--font-funnel-display",
  subsets: ["latin"]
});

const basePath = getBasePath();
// When basePath is empty, use absolute path; otherwise prefix with basePath
const iconPath = basePath ? `${basePath}/icon.svg` : "/icon.svg";

export const metadata: Metadata = {
  icons: {
    icon: iconPath,
    shortcut: iconPath,
    apple: iconPath,
  },
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${funnelDisplay.variable} antialiased`}
      >
        <PlausibleProvider
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? ""}
        >
          <Header />
          <main className="w-full h-auto mx-auto">
            <div className="flex flex-col mx-auto relative justify-center items-center">
              {children}
            </div>
          </main>
          <Footer />
        </PlausibleProvider>
        <Analytics />
      </body>
    </html>
  );
}
