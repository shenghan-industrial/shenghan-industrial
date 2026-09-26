import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Stationery, Beauty, Fashion, Toys, Hygiene, Hardware, Appliances, Sports, Plastic, Furniture & Lighting | DEXOREN",
  description:
    "Browse DEXOREN's full product range: stationery, beauty & skincare, fashion accessories, toys, hygiene products, hardware supplies, home appliances, sports & outdoor, plastic products, furniture and lighting. Factory direct wholesale pricing — inquire today.",
  keywords: [
    "stationery wholesale",
    "beauty and skincare supplier",
    "fashion accessories factory",
    "toys wholesale",
    "hygiene products supplier",
    "hardware supplies wholesale",
    "home appliances factory",
    "sports and outdoor wholesale",
    "plastic products supplier",
    "furniture factory",
    "lighting factory",
    "China wholesale supplier",
    "B2B general merchandise",
  ],
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
