import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ClientWrapper } from "@/components/ClientWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shenghan Industrial | Professional Structural Adhesive Solutions",
  description:
    "Shenghan Industrial specializes in high-performance structural adhesives and building sealants, delivering reliable bonding solutions for construction projects worldwide.",
  keywords: [
    "structural adhesive",
    "building sealant",
    "silicone sealant",
    "weatherproof sealant",
    "stone adhesive",
    "insulating glass sealant",
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
        </ClientWrapper>
      </body>
    </html>
  );
}
