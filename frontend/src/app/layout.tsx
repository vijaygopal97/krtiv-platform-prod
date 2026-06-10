import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/kraik";
const favicon = basePath ? `${basePath}/favicon.png` : "/favicon.png";

export const metadata: Metadata = {
  title: "Maharashtra Tourism",
  description: "You will find India here — discover Maharashtra through its forts, ghats, coasts and villages.",
  icons: { icon: favicon },
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
        {children}
      </body>
    </html>
  );
}
