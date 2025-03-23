import type { Metadata } from "next";
import { satoshi } from "./fonts/satoshi";
import "./globals.css";
import { Nav } from "./components/ui/nav";

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
      <body className={`${satoshi.className} antialiased w-full bg-black text-white min-h-screen`}>
        <Nav />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
