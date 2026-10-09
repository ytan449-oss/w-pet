import { brand, brandExcerpt } from "./brand";
import { craft } from "./craft";
import { products } from "./products";
import type { LocalizedText } from "../types/catalog";

interface BrandFaq {
  id: string;
  question: LocalizedText;
  /** Answers are original English source, not translations or paraphrases. */
  answer: string;
}

export const brandFaqs = [
  {
    id: "origin",
    question: { en: "Where was W Pet founded?", zh: "W Pet 创立于哪里？" },
    answer: brandExcerpt("Founded in New Zealand, W Pet inherits the touching memory of Wellness."),
  },
  {
    id: "wellness",
    question: { en: "What inspired W Pet?", zh: "W Pet 的灵感来自哪里？" },
    answer: brand.storyParagraphs[0],
  },
  {
    id: "philosophy",
    question: { en: "What is W Pet’s design philosophy?", zh: "W Pet 的设计理念是什么？" },
    answer: craft.philosophy,
  },
  {
    id: "craft",
    question: { en: "What guides the colours and craftsmanship?", zh: "W Pet 的色彩与工艺有什么特点？" },
    answer: craft.design,
  },
] as const satisfies readonly BrandFaq[];

/** Official washing/storage instructions have not been supplied; never infer them. */
export const careInformation = {
  status: "pending",
  instructions: null,
} as const;

/** Answers reuse approved catalog values without inventing washing guidance. */
const productQuestions: { id: string; question: LocalizedText }[] = [
  { id: "breaking-load", question: { en: "What are the version breaking loads?", zh: "两种版本的断裂载荷分别是多少？" } },
  { id: "length", question: { en: "Which lengths are available?", zh: "有哪些长度可选？" } },
  { id: "color", question: { en: "Which colour and custom-colour options are supplied?", zh: "有哪些配色及定制选择？" } },
  { id: "material", question: { en: "What material performance is specified?", zh: "已提供的材质性能是什么？" } },
  { id: "outdoors", question: { en: "Which outdoor settings is it designed for?", zh: "适配哪些户外场景？" } },
];
export const productFaqs = productQuestions.map(item => {
  const specification = products[0].specifications.find(row => row.id === item.id);
  if (!specification) throw new Error("Product FAQ requires an approved catalog specification.");
  return { ...item, answer: specification.value };
});
