import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "Kickdata - Analyses football par IA",
  description: "Données, statistiques et pronostics football générés par intelligence artificielle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex bg-[#05080f]">
          <Providers>
            <Sidebar />
            <div className="flex-1 sm:ml-56 pb-16 sm:pb-0">{children}</div>
          </Providers>
        </body>
    </html>
  );
}
