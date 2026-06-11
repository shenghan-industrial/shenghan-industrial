import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Direct Factory Manufacturer in China | Shenghan Industrial",
  description:
    "Shenghan Industrial is a China-based factory manufacturer with years of export experience specializing in furniture, building materials, hardware, lighting, and home appliances. Serving global buyers with reliable quality and competitive factory-direct pricing.",
  keywords: [
    "China factory",
    "furniture factory China",
    "building materials supplier China",
    "OEM manufacturer",
    "wholesale furniture China",
    "Shenghan Industrial factory",
    "furniture export China",
    "factory direct sourcing",
    "B2B furniture supplier",
  ],
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
