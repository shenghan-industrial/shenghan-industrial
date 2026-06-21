import type { Product, MultiLangText } from "@/data/products";

export type Locale = "en" | "zh" | "es";

export function localizeProduct(product: Product, locale: Locale) {
  return {
    name: product.name[locale] || product.name.en,
    subtitle: product.subtitle[locale] || product.subtitle.en,
    description: product.description[locale] || product.description.en,
    features: product.features[locale]?.length ? product.features[locale] : product.features.en,
    specs: product.specs[locale]?.length ? product.specs[locale] : product.specs.en,
    badge: product.badge?.[locale] || product.badge?.en,
    seoTitle: product.seoTitle?.[locale] || product.seoTitle?.en,
    seoDescription: product.seoDescription?.[locale] || product.seoDescription?.en,
  };
}

export function pickLang(ml: MultiLangText | undefined, locale: Locale): string {
  if (!ml) return "";
  return ml[locale] || ml.en || "";
}

export function localizeCategoryName(
  cat: { name: MultiLangText } | { name: string; nameZh?: string; nameEs?: string },
  locale: Locale
): string {
  if (cat.name && typeof cat.name === "object" && "en" in cat.name) {
    return (cat.name as MultiLangText)[locale] || (cat.name as MultiLangText).en;
  }
  const c = cat as { name: string; nameZh?: string; nameEs?: string };
  if (locale === "zh" && c.nameZh) return c.nameZh;
  if (locale === "es" && c.nameEs) return c.nameEs;
  return c.name;
}

export function localizePartner(
  partner: {
    name: MultiLangText;
    description: MultiLangText;
    location: MultiLangText;
    specialties: MultiLangArray;
  },
  locale: Locale
) {
  return {
    name: pickLang(partner.name, locale),
    description: pickLang(partner.description, locale),
    location: pickLang(partner.location, locale),
    specialties: partner.specialties[locale]?.length ? partner.specialties[locale] : partner.specialties.en,
  };
}

// Re-export MultiLangArray from products for convenience
import type { MultiLangArray } from "@/data/products";
