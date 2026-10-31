import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepurposeOne — Into the Repurposer | Content Transformation Sequence",
  description: "One original piece of content can become multiple formats across LinkedIn, X, Instagram, and YouTube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased bg-[#f8f9fc] text-[#1a1d2d] font-sans selection:bg-amber-100 selection:text-amber-900">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
