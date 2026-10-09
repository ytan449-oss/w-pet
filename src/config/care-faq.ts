import { brand, brandExcerpt } from "./brand";
import { craft } from "./craft";
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
