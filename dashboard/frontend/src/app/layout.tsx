import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Use Outfit as per design
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScraperOS | Command Center",
  description: "Job Outreach Automation Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.className} antialiased bg-[#0f172a] text-white`}>
        {children}
      </body>
    </html>
  );
}
