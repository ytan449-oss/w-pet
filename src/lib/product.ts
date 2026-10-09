import type { Locale, Product, ProductVariant } from "../types/catalog";
export const versionLabel = (version: ProductVariant["version"], locale: Locale) => locale === "zh" ? (version === "standard" ? "标准版" : "轻量版") : (version === "standard" ? "Standard" : "Lightweight");
export const lengthLabel = (lengthCm: number) => `${lengthCm / 100}m`;
export const retailPriceLabel = (locale: Locale) => locale === "zh" ? "售价待确认" : "Retail price to be confirmed";
export const conceptLabel = (locale: Locale) => locale === "zh" ? "概念图片" : "Concept imagery";
export function variantLabel(product: Product, variant: ProductVariant, locale: Locale) {
  const color = product.colors.find(c => c.id === variant.colorId);
  return `${versionLabel(variant.version, locale)} · ${lengthLabel(variant.lengthCm)} · ${color?.name[locale] ?? variant.colorId}`;
}
