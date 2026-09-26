import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get a Factory Quote | DEXOREN",
  description:
    "Contact DEXOREN for factory-direct pricing on furniture, building materials, hardware, lighting, and home appliances. Send your inquiry and our team will reply within 24 hours with a customized quote.",
  keywords: [
    "contact furniture factory",
    "get quote furniture China",
    "wholesale inquiry",
    "DEXOREN contact",
    "factory direct quote",
    "furniture sourcing contact",
    "B2B inquiry",
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
