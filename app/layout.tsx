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
    default: "Shengyu Industrial | Global Home & Building Materials Manufacturer",
    template: "%s | Shengyu Industrial",
  },
  description:
    "Shengyu Industrial is a global B2B manufacturer. Factory direct pricing, reliable multi-channel logistics, full global compliance, and 24/7 after-sales support — serving importers, contractors, and wholesalers worldwide.",
  keywords: [
    "building materials manufacturer", "home furniture factory", "hardware supplier",
    "LED lighting factory", "global B2B manufacturer", "Shengyu Industrial",
    "factory direct supply", "one-stop supply chain", "OEM ODM manufacturer",
    "global logistics", "wholesale building materials",
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
    siteName: "Shengyu Industrial",
    title: "Shengyu Industrial | Global Home & Building Materials Manufacturer",
    description: "Factory direct B2B manufacturer — furniture, building materials, hardware, lighting, and appliances.",
    url: BASE,
    locale: "en_US",
    alternateLocale: ["zh_CN", "es_ES"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shengyu Industrial | Global B2B Manufacturer",
    description: "Factory direct B2B manufacturer — one-stop supply chain from China.",
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
