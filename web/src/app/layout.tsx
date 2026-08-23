import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "OpenNutriSync",
  description: "Self-hosted nutrition & micronutrient dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body className="min-h-screen bg-background text-foreground">
        <header className="border-b px-6 py-4">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">OpenNutriSync</h1>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground">Dashboard</a>
              <a href="/history" className="hover:text-foreground">History</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
