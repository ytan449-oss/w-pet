export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;

export interface Product {
  id: string;
  slug: string;
  collectionSlug: string;
  name: LocalizedText;
  description: LocalizedText;
  color: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  priceMinor: number;
  currency: "NZD";
  isPreview: boolean;
}

export interface Collection {
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
}

/** Pages depend on this interface, so CMS integration can replace the adapter. */
export interface CatalogRepository {
  getCollection(slug: string): Promise<Collection | undefined>;
  getProducts(collectionSlug?: string): Promise<readonly Product[]>;
  getProduct(slug: string): Promise<Product | undefined>;
}
