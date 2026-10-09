import { collections, products } from "@/config/products";
import type { CatalogRepository, Locale } from "@/types/catalog";

export const catalog: CatalogRepository = {
  async getCollection(slug) {
    return collections.find((collection) => collection.slug === slug);
  },
  async getProducts(collectionSlug) {
    return collectionSlug
      ? products.filter((product) => product.collectionSlug === collectionSlug)
      : products;
  },
  async getProduct(slug) {
    return products.find((product) => product.slug === slug);
  },
};

export function formatPrice(priceMinor: number, locale: Locale, currency = "NZD") {
  return new Intl.NumberFormat(locale === "en" ? "en-NZ" : "zh-CN", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(priceMinor / 100);
}
