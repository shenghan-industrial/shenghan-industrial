import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { InquiryCart } from "@/components/InquiryCart";
import { ClientWrapper } from "@/components/ClientWrapper";
import { GlobalInfoBar } from "@/components/GlobalInfoBar";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shenghan Industrial | Global Home & Building Materials Manufacturer | One-stop Supply Chain Partner",
  description:
    "Shenghan Industrial is a global B2B manufacturer. Factory direct pricing, reliable multi-channel logistics, full global compliance, and 24/7 after-sales support — serving importers, contractors, and wholesalers worldwide.",
  keywords: [
    "building materials manufacturer",
    "home furniture factory",
    "hardware supplier",
    "LED lighting factory",
    "global B2B manufacturer",
    "Shenghan Industrial",
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
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ScrollToTop />
          <CookieConsent />
          <GlobalInfoBar />
          <Footer />
          <InquiryCart />
          <Script
            id="tawk-to"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/6a1d03fc783d581c2cec1085/1jq0lf5ia';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();`,
            }}
          />
        </ClientWrapper>
      </body>
    </html>
  );
}
