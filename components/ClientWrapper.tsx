"use client";

import { LanguageProvider } from "@/lib/LanguageContext";
import { InquiryProvider } from "@/lib/InquiryContext";
import type { ReactNode } from "react";

export function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <InquiryProvider>{children}</InquiryProvider>
    </LanguageProvider>
  );
}
