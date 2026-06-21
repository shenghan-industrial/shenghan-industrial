/**
 * Schema.org JSON-LD generators for SEO structured data.
 */
import type { Product } from "@/data/products";

// ── Organization Schema ───────────────────────────────────
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Shengyu Industrial",
    alternateName: "Shenghan Industrial",
    url: "https://shenghanindustrial.com",
    logo: "https://shenghanindustrial.com/favicon.ico",
    description: "Global manufacturer of home furniture, building materials, hardware, lighting, and appliances — one-stop B2B supply chain from China.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+86-13800000000",
      email: "shenghanind@163.com",
      availableLanguage: ["English", "Chinese", "Spanish"],
    },
    sameAs: [
      "https://www.linkedin.com/company/shenghan-industrial",
      "https://www.youtube.com/@shenghanindustrial",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
    },
  };
}

// ── Product Schema ────────────────────────────────────────
export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name.en,
    description: product.description.en,
    sku: product.sku || product.id,
    mpn: product.model || product.id,
    image: product.gallery || product.images || [product.image],
    brand: {
      "@type": "Brand",
      name: "Shengyu Industrial",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Shengyu Industrial",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: product.price || "0",
      priceCurrency: "USD",
      itemCondition: "https://schema.org/NewCondition",
      // No shipping details — B2B quotation-based
    },
  };
}

// ── Breadcrumb Schema ─────────────────────────────────────
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ── FAQ Schema ────────────────────────────────────────────
export function faqSchema(
  questions: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

// ── Render JSON-LD script tag ─────────────────────────────
export function JsonLD({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
