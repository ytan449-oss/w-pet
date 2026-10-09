export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;

export interface ProductVariant {
  id: string;
  version: "standard" | "lightweight";
  lengthCm: 120 | 200;
  colorId: string;
  breakingLoadKg: 400 | 200;
}
export interface ProductImage { src: string; alt: LocalizedText; view: LocalizedText; isConcept: boolean; }
export interface ProductSpecification { id: string; label: LocalizedText; value: LocalizedText; }

export interface Product {
  id: string;
  slug: string;
  collectionSlug: string;
  name: LocalizedText;
  description: LocalizedText;
  color: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  /** No retail price has been supplied. */
  priceMinor: number | null;
  testUnitAmountMinor: number;
  variants: readonly ProductVariant[];
  colors: readonly { id: string; name: LocalizedText; swatch: readonly string[] }[];
  gallery: readonly ProductImage[];
  specifications: readonly ProductSpecification[];
  certification: { status: "awaiting-report" | "verified"; reportUrl: string | null };
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
