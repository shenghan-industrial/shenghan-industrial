import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Sofas, Beds, Building Materials, Hardware & More | Shengyu Industrial",
  description:
    "Browse Shengyu Industrial's full product range: fabric sofas, PU beds, MDF/plywood boards, furniture hardware, LED lighting, home appliances, adhesives, and industrial materials. Factory direct wholesale pricing — inquire today.",
  keywords: [
    "sofa factory",
    "bed frame wholesale",
    "MDF board supplier",
    "plywood manufacturer",
    "furniture hardware",
    "LED lighting factory",
    "home appliances wholesale",
    "adhesive manufacturer",
    "PVC board",
    "factory direct furniture",
    "China furniture supplier",
    "wholesale furniture",
    "OEM furniture",
  ],
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
