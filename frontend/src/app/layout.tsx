import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { getPortfolio } from "@/lib/api/portfolio";
import ThemeProvider from "@/components/theme/ThemeProvider";

import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();

  return {
    title: profile?.name,
    description: profile?.bio ?? profile?.name,
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
        </ThemeProvider>
      </body>
    </html>
  );
}
