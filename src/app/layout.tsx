import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { AchievementToast } from "@/components/achievements/achievement-toast";
import { AtmosphereBackground } from "@/components/atmosphere-background";
import { BackToTop } from "@/components/back-to-top";
import { CardSpotlight } from "@/components/card-spotlight";
import { ChapterTracker } from "@/components/chapter-tracker";
import { CustomCursor } from "@/components/custom-cursor";
import { GlobalCanvasProvider } from "@/components/GlobalCanvasProvider";
import { MouseForceProvider } from "@/components/mouse-force-provider";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import "./globals.css";

export const metadata: Metadata = {
  title: "David Liu | Mechanical Engineering, Robotics & Autonomous Systems",
  description:
    "Portfolio for David Liu, a Harvey Mudd mechanical engineering student building robotics, autonomous systems, aerospace, and manufacturing automation projects.",
  metadataBase: new URL("https://david-liu-portfolio.vercel.app"),
  openGraph: {
    title: "David Liu | Mechanical Engineering Portfolio",
    description: "Robotics, aerospace, autonomous systems, CAD, simulation, manufacturing, and mechatronics.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "David Liu | Mechanical Engineering Portfolio",
    description: "Robotics, aerospace, autonomous systems, CAD, simulation, manufacturing, and mechatronics."
  },
  robots: {
    index: true,
    follow: true
  }
};

/** Person structured data — lets Google show a rich knowledge panel result for the portfolio. */
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "David Liu",
  url: "https://david-liu-portfolio.vercel.app",
  jobTitle: "Mechanical Engineering Student",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Harvey Mudd College"
  },
  knowsAbout: [
    "Mechanical Engineering",
    "Robotics",
    "High-Power Rocketry",
    "Autonomous Underwater Vehicles",
    "CAD",
    "Manufacturing"
  ],
  sameAs: ["https://www.linkedin.com/in/david-liu-677113283/", "https://github.com/davidliu06"]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <CustomCursor />
        <CardSpotlight />
        <ScrollProgress />
        <SmoothScrollProvider />
        <MouseForceProvider />
        <GlobalCanvasProvider />
        <AtmosphereBackground />
        <ChapterTracker />
        <AchievementToast />
        <BackToTop />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
