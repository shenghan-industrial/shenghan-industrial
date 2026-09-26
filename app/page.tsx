"use client";

import { Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { TrustBar } from "@/components/TrustBar";
import { FeatureCards } from "@/components/FeatureCards";
import { HomeMerchandiseGrid } from "@/components/HomeMerchandiseGrid";
import { ShowroomStrength } from "@/components/ShowroomStrength";

function HomeContent() {
  return (
    <main className="min-h-screen bg-[#F5F2EF] dark:bg-[#12100E]">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust Bar — immediately after Hero */}
      <TrustBar />

      {/* 3. Home & General Merchandise category grid */}
      <HomeMerchandiseGrid />

      {/* 4. Showroom & warehouse strength */}
      <ShowroomStrength />

      {/* 5. Feature Cards */}
      <section className="pt-8 md:pt-16 pb-2 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <FeatureCards />
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <ReviewsSection />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#1A1816]" />}>
      <HomeContent />
    </Suspense>
  );
}
