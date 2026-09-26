import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";
import { ClientWrapper } from "@/components/ClientWrapper";
import { organizationSchema, JsonLD } from "@/lib/schema-org";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE = "https://shenghanindustrial.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "DEXOREN | Home & General Merchandise Supply Chain",
    template: "%s | DEXOREN",
  },
  description:
    "DEXOREN is a one-stop home & general merchandise supply chain partner. 8,000㎡ wholesale showroom, 30,000+ SKUs, factory-direct pricing and reliable export logistics — serving importers, retailers and B2B buyers worldwide.",
  keywords: [
    "home goods wholesale", "general merchandise supplier", "home products factory", "household items bulk",
    "home goods supply chain", "kitchenware wholesale", "home textiles supplier", "B2B home products",
    "wholesale showroom China", "DEXOREN", "one-stop sourcing", "household appliances wholesale",
  ],
  alternates: {
    canonical: BASE,
    languages: {
      en: BASE,
      zh: BASE,
      es: BASE,
    },
  },
  openGraph: {
    type: "website",
    siteName: "DEXOREN",
    title: "DEXOREN | Home & General Merchandise Supply Chain",
    description: "One-stop home goods supply chain — 8,000㎡ wholesale showroom, 30,000+ SKUs, factory-direct export.",
    url: BASE,
    locale: "en_US",
    alternateLocale: ["zh_CN", "es_ES"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEXOREN | Home & General Merchandise Supply Chain",
    description: "One-stop home goods supply chain — 8,000㎡ showroom, 30,000+ SKUs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLD data={organizationSchema()} />
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
