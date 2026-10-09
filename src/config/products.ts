import { brand } from "./brand";
import type { Collection, Product } from "../types/catalog";

export const collections = [{
  slug: "aotearoa-bloom",
  name: { en: "Aotearoa Bloom Collection", zh: "Aotearoa Bloom 花卉系列" },
  description: { en: brand.sloganEn, zh: brand.sloganZh },
}] satisfies readonly Collection[];

/** Owner-supplied specifications. Retail price and test report remain pending. */
export const products = [{
  id: "aotearoa-bloom-leash",
  slug: "aotearoa-bloom-hand-woven-dog-leash",
  collectionSlug: "aotearoa-bloom",
  name: { en: "Aotearoa Bloom Hand-Woven Dog Leash", zh: "Aotearoa Bloom 手工编织狗牵引绳" },
  description: { en: "Double-strand woven cotton-core rope for New Zealand beaches, trails and bush hikes.", zh: "双股编织棉芯绳，适配海滩、步道、丛林徒步等新西兰户外场景。" },
  color: { en: "Pink Mint Haze", zh: "Pink Mint Haze" },
  image: "/images/leash-pink-mint-overview.webp",
  imageAlt: { en: "Concept view of the Pink Mint Haze hand-woven dog leash", zh: "Pink Mint Haze 手工编织狗牵引绳概念图" },
  priceMinor: null,
  // Sandbox-only NZD 1.00 per unit; never display as a retail price.
  testUnitAmountMinor: 100,
  currency: "NZD",
  isPreview: true,
  colors: [{ id: "pink-mint-haze", name: { en: "Pink Mint Haze", zh: "Pink Mint Haze" }, swatch: ["#f2b8c0", "#b8dacf"] }],
  variants: [
    { id: "ab-standard-120-pmh", version: "standard", lengthCm: 120, colorId: "pink-mint-haze", breakingLoadKg: 400 },
    { id: "ab-standard-200-pmh", version: "standard", lengthCm: 200, colorId: "pink-mint-haze", breakingLoadKg: 400 },
    { id: "ab-lightweight-120-pmh", version: "lightweight", lengthCm: 120, colorId: "pink-mint-haze", breakingLoadKg: 200 },
    { id: "ab-lightweight-200-pmh", version: "lightweight", lengthCm: 200, colorId: "pink-mint-haze", breakingLoadKg: 200 },
  ],
  gallery: [
    { src: "/images/leash-pink-mint-overview.webp", view: { en: "Full view", zh: "整体视角" }, alt: { en: "Concept overview of a pink and mint woven leash with a wrist loop and swivel locking clip", zh: "概念整体图：粉色与薄荷绿编织牵引绳、手环及旋转锁扣" }, isConcept: true },
    { src: "/images/leash-pink-mint-weave.webp", view: { en: "Woven detail", zh: "编织细节" }, alt: { en: "Concept angled detail of the Pink Mint Haze braid and wrist loop", zh: "概念斜角图：Pink Mint Haze 编织与手环细节" }, isConcept: true },
    { src: "/images/leash-pink-mint-locking-clip.webp", view: { en: "Locking clip", zh: "锁扣细节" }, alt: { en: "Concept angled detail of the rotating locking clip and woven rope join", zh: "概念斜角图：旋转锁扣与编织绳连接细节" }, isConcept: true },
  ],
  specifications: [
    { id: "rope", label: { en: "Rope", zh: "绳体" }, value: { en: "Double-strand woven cotton-core rope", zh: "双股编织棉芯绳" } },
    { id: "breaking-load", label: { en: "Breaking load", zh: "断裂载荷" }, value: { en: "Standard 400kg · Lightweight 200kg", zh: "标准版 400kg · 轻量版 200kg" } },
    { id: "length", label: { en: "Lengths", zh: "长度" }, value: { en: "1.2m / 2m", zh: "1.2m / 2m" } },
    { id: "outdoors", label: { en: "Outdoor settings", zh: "适配场景" }, value: { en: "New Zealand beaches, trails and bush hikes", zh: "海滩、步道、丛林徒步等新西兰户外场景" } },
    { id: "material", label: { en: "Material performance", zh: "材质性能" }, value: { en: "Weather and salt-spray resistant; resistant to sun fading", zh: "耐候抗盐雾、抗日晒褪色" } },
    { id: "clip", label: { en: "Hardware", zh: "锁扣" }, value: { en: "Rust-resistant rotating locking clip", zh: "防锈旋转锁扣" } },
    { id: "color", label: { en: "Colour", zh: "配色" }, value: { en: "Pink Mint Haze; small-batch custom colours available", zh: "Pink Mint Haze；支持小批量定制配色" } },
  ],
  certification: { status: "awaiting-report", reportUrl: null },
}] satisfies readonly Product[];
