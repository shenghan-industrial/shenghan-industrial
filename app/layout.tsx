import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { ClientWrapper } from "@/components/ClientWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shengyu Industrial | Global Home & Building Materials Manufacturer | One-stop Supply Chain Partner",
  description:
    "Shengyu Industrial is a global B2B manufacturer. Factory direct pricing, reliable multi-channel logistics, full global compliance, and 24/7 after-sales support — serving importers, contractors, and wholesalers worldwide.",
  keywords: [
    "building materials manufacturer",
    "home furniture factory",
    "hardware supplier",
    "LED lighting factory",
    "global B2B manufacturer",
    "Shengyu Industrial",
    "factory direct supply",
    "one-stop supply chain",
    "OEM ODM manufacturer",
    "global logistics",
    "wholesale building materials",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-[#12100E] text-text-primary dark:text-[#E4E5E9]`}>
        <ClientWrapper>
          <SiteChrome>{children}</SiteChrome>
        </ClientWrapper>
      </body>
    </html>
  );
}
