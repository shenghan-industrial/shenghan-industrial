import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Get a Factory Quote | Shengyu Industrial",
  description:
    "Contact Shengyu Industrial for factory-direct pricing on furniture, building materials, hardware, lighting, and home appliances. Send your inquiry and our team will reply within 24 hours with a customized quote.",
  keywords: [
    "contact furniture factory",
    "get quote furniture China",
    "wholesale inquiry",
    "Shengyu Industrial contact",
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
