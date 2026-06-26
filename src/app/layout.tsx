import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { AchievementToast } from "@/components/achievements/achievement-toast";
import { AtmosphereBackground } from "@/components/atmosphere-background";
import { ChapterTracker } from "@/components/chapter-tracker";
import { MouseForceProvider } from "@/components/mouse-force-provider";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "David Liu | Mechanical Engineering, Robotics & Autonomous Systems",
  description:
    "Portfolio for David Liu, a Harvey Mudd mechanical engineering student building robotics, autonomous systems, aerospace, and manufacturing automation projects.",
  metadataBase: new URL("https://david-liu-portfolio.vercel.app"),
  openGraph: {
    title: "David Liu | Mechanical Engineering Portfolio",
    description: "Robotics, aerospace, autonomous systems, CAD, simulation, manufacturing, and mechatronics.",
    type: "website",
    images: ["/images/david-headshot.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} ${outfit.variable} ${GeistMono.variable}`} lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SmoothScrollProvider />
        <MouseForceProvider />
        <AtmosphereBackground />
        <ChapterTracker />
        <AchievementToast />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
