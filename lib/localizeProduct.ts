import type { Product } from "@/data/products";

export type Locale = "en" | "zh" | "es";

export function localizeProduct(product: Product, locale: Locale) {
  const name =
    (locale === "zh" ? product.nameZh : locale === "es" ? product.nameEs : undefined) ?? product.name;
  const subtitle =
    (locale === "zh" ? product.subtitleZh : locale === "es" ? product.subtitleEs : undefined) ?? product.subtitle;
  const description =
    (locale === "zh" ? product.descriptionZh : locale === "es" ? product.descriptionEs : undefined) ?? product.description;
  const features =
    (locale === "zh" ? product.featuresZh : locale === "es" ? product.featuresEs : undefined) ?? product.features;
  const specs =
    (locale === "zh" ? product.specsZh : locale === "es" ? product.specsEs : undefined) ?? product.specs;
  const badge =
    (locale === "zh" ? product.badgeZh : locale === "es" ? product.badgeEs : undefined) ?? product.badge;

  const promoTagMap: Record<string, Record<string, string>> = {
    zh: { "热卖": "热卖", "爆款": "爆款", "新品": "新品" },
    en: { "热卖": "Hot Seller", "爆款": "Best Seller", "新品": "New" },
    es: { "热卖": "Más Vendido", "爆款": "Best Seller", "新品": "Nuevo" },
  };
  const promoTag = product.promoTag ? (promoTagMap[locale]?.[product.promoTag] ?? product.promoTag) : undefined;

  return { name, subtitle, description, features, specs, badge, promoTag };
}

export function localizeCategoryName(
  cat: { name: string; nameZh?: string; nameEs?: string },
  locale: Locale
): string {
  if (locale === "zh" && cat.nameZh) return cat.nameZh;
  if (locale === "es" && cat.nameEs) return cat.nameEs;
  return cat.name;
}

export function localizePartner(
  partner: {
    name: string;
    nameZh?: string;
    nameEs?: string;
    description: string;
    descriptionZh?: string;
    descriptionEs?: string;
    location: string;
    locationZh?: string;
    locationEs?: string;
    specialties: string[];
    specialtiesZh?: string[];
    specialtiesEs?: string[];
  },
  locale: Locale
) {
  return {
    name: (locale === "zh" ? partner.nameZh : locale === "es" ? partner.nameEs : undefined) ?? partner.name,
    description: (locale === "zh" ? partner.descriptionZh : locale === "es" ? partner.descriptionEs : undefined) ?? partner.description,
    location: (locale === "zh" ? partner.locationZh : locale === "es" ? partner.locationEs : undefined) ?? partner.location,
    specialties: (locale === "zh" ? partner.specialtiesZh : locale === "es" ? partner.specialtiesEs : undefined) ?? partner.specialties,
  };
}
