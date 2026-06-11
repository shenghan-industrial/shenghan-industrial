import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get a Factory Quote | Shenghan Industrial",
  description:
    "Contact Shenghan Industrial for factory-direct pricing on furniture, building materials, hardware, lighting, and home appliances. Send your inquiry and our team will reply within 24 hours with a customized quote.",
  keywords: [
    "contact furniture factory",
    "get quote furniture China",
    "wholesale inquiry",
    "Shenghan Industrial contact",
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
