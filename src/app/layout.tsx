import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
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

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t?t==='dark':true)}catch(e){document.documentElement.classList.add('dark')}"
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
