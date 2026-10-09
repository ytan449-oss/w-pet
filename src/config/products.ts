import type { Collection, Product } from "@/types/catalog";

/** Concept products and indicative prices, pending brand approval. */
export const collections = [
  {
    slug: "aotearoa-bloom",
    name: { en: "Aotearoa Bloom Collection", zh: "Aotearoa Bloom 花卉系列" },
    description: {
      en: "A little piece of nature, for your everyday adventures together.",
      zh: "把自然的诗意，带进你与毛孩子的每一次出发。",
    },
  },
] satisfies readonly Collection[];

export const products = [
  {
    id: "preview-bloom-rose",
    slug: "bloom-bandana-rose",
    collectionSlug: "aotearoa-bloom",
    name: { en: "Bloom Bandana", zh: "Bloom 花卉三角巾" },
    description: { en: "A floral bandana concept in soft rose tones.", zh: "柔和玫瑰色调的花卉三角巾概念款。" },
    color: { en: "Wild Rose", zh: "野玫瑰" },
    image: "/images/bandana-rose.svg",
    imageAlt: { en: "Illustrated concept of a rose floral pet bandana", zh: "玫瑰色花卉宠物三角巾概念插画" },
    priceMinor: 3200,
    currency: "NZD",
    isPreview: true,
  },
  {
    id: "preview-bloom-sage",
    slug: "bloom-bandana-sage",
    collectionSlug: "aotearoa-bloom",
    name: { en: "Bloom Bandana", zh: "Bloom 花卉三角巾" },
    description: { en: "A botanical bandana concept in gentle sage green.", zh: "温柔鼠尾草绿的植物纹样三角巾概念款。" },
    color: { en: "Garden Sage", zh: "花园鼠尾草" },
    image: "/images/bandana-sage.svg",
    imageAlt: { en: "Illustrated concept of a sage botanical pet bandana", zh: "鼠尾草绿植物纹样宠物三角巾概念插画" },
    priceMinor: 3200,
    currency: "NZD",
    isPreview: true,
  },
  {
    id: "preview-bloom-flax",
    slug: "bloom-bandana-flax",
    collectionSlug: "aotearoa-bloom",
    name: { en: "Bloom Bandana", zh: "Bloom 花卉三角巾" },
    description: { en: "A wildflower bandana concept in warm, natural tones.", zh: "温暖自然色调的野花三角巾概念款。" },
    color: { en: "Golden Meadow", zh: "金色草甸" },
    image: "/images/bandana-flax.svg",
    imageAlt: { en: "Illustrated concept of a golden wildflower pet bandana", zh: "金色野花宠物三角巾概念插画" },
    priceMinor: 3200,
    currency: "NZD",
    isPreview: true,
  },
] satisfies readonly Product[];
