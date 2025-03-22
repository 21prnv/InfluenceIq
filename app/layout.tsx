import type { Metadata } from "next";
import { satoshi } from "./fonts/satoshi";
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "ImpactArc - AI-Powered Influence Rating System",
  description: "Measure and analyze true digital influence with advanced AI algorithms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${satoshi.className} antialiased w-full`}>
        <div className="flex min-h-screen">
          <Sidebar className="fixed left-0 top-0 bottom-0 z-30" />
          <main className="flex-1 ml-[80px] lg:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
