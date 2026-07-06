import type { Metadata } from "next";
import "./globals.css";
import "@/styles/hero-mobile.css";
import "@/styles/category-hero-ambience.css";
import "@/styles/hero-category-mobile.css";
import "@/styles/category-hero-sky.css";
import "@/styles/shekru-loader.css";
import "@/styles/site-nav-dropdown.css";
import "@/styles/luxury-hero-heading.css";
import "@/styles/site-header.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { CmsClientRoot } from "@/components/cms/CmsClientRoot";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/kraik";
const favicon = basePath ? `${basePath}/favicon.png` : "/favicon.png";

export const metadata: Metadata = {
  title: "Maharashtra Tourism",
  description: "You will find India here — discover Maharashtra through its forts, ghats, coasts and villages.",
  icons: { icon: favicon },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GoogleAnalytics />
        <CmsClientRoot>{children}</CmsClientRoot>
      </body>
    </html>
  );
}
