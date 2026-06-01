import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ClientWrapper } from "@/components/ClientWrapper";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shenghan Industrial | Furniture, Building Materials & Hardware | Direct Factory Manufacturer",
  description:
    "Shenghan Industrial is a direct factory manufacturer specializing in furniture, building materials, hardware, lighting, home appliances, and industrial products — delivering quality solutions for global buyers.",
  keywords: [
    "furniture manufacturer",
    "building materials",
    "hardware supplier",
    "LED lighting factory",
    "home appliances",
    "industrial products",
    "Shenghan Industrial",
    "factory direct",
    "China manufacturer",
    "sofa factory",
    "adhesives",
    "furniture hardware",
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
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-[#0A0D12] text-text-primary dark:text-[#E4E5E9]`}>
        <ClientWrapper>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ScrollToTop />
          <CookieConsent />
          <Footer />
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
