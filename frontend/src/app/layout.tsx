import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { getPortfolio } from "@/lib/api/portfolio";
import ThemeProvider from "@/components/theme/ThemeProvider";
import PortfolioAI from "@/components/ai/PortfolioAI";

import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});


export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();

  const name = profile?.name || "Ketan Suthar";

  const description =
    profile?.bio ||
    "Full Stack Developer specializing in MERN Stack, Next.js, React and AI integration.";

  return {
    metadataBase: new URL(
      "https://ketansutharsportfolio.netlify.app"
    ),

    title: `${name} | Full Stack Developer`,
    description,

    keywords: [
      "Ketan Suthar",
      "Ketan Suthar Portfolio",
      "Full Stack Developer",
      "MERN Stack Developer",
      "Next.js Developer",
      "React Developer",
      "AI Integration",
      "Software Developer India",
    ],

    alternates: {
      canonical: "/",
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${name} | Full Stack Developer`,
      description,
      url: "https://ketansutharsportfolio.netlify.app",
      siteName: `${name} Portfolio`,
      type: "website",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title: `${name} | Full Stack Developer`,
      description,
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetBrainsMono.variable}>
        <ThemeProvider>
          {children}
          <PortfolioAI />
        </ThemeProvider>
      </body>
    </html>
  );
}
