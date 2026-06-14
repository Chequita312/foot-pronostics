import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import { Providers } from "./providers";
import { auth } from "@/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex bg-[#05080f]">
          <Providers session={session}>
            <Sidebar />
            <div className="flex-1 sm:ml-56 pb-16 sm:pb-0">{children}</div>
          </Providers>
        </body>
    </html>
  );
}
