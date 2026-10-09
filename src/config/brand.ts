/**
 * Approved brand copy supplied by the brand owner, verbatim.
 * Keep the original language: no translated or shortened marketing copy.
 */
const story = `W Pet was born from a tender twelve-year companionship and a heartfelt regret. On a cold winter day in New Zealand, six-year-old Aria met a puppy named Wellness. As a simple farm watchdog, Wellness spent its early days with only an iron chain and a rough cloth collar, living a dull and colorless life without delicate accessories or joyful playtimes.
Aria studied far away from home in her growing years. Every holiday reunion became the warmest bond between them. For twelve years, Wellness accompanied Aria through her entire youth with pure loyalty. When Aria turned eighteen, Wellness passed away peacefully due to old age. The lingering longing and gentle regret made her determined: no sincere and loyal pet deserves a plain and monotonous life.
Founded in New Zealand, W Pet inherits the touching memory of Wellness. Adhering to the core philosophy of "painting life with colors in the name of companionship", we are committed to breaking the dull design of traditional pet supplies. With healing dopamine color palettes, exquisite hand-woven craftsmanship and reliable safety quality, we create premium pet gear rooted in local Kiwi aesthetics and outdoor lifestyles. W Pet devotes all tenderness to every loyal furry companion, repaying every unconditional devotion with gorgeous colors and meticulous design.`;

export const brand = {
  slogan: "以爱织色，温柔伴宠一生。Designed in Aotearoa | Colored for every loyal companion.",
  sloganZh: "以爱织色，温柔伴宠一生。",
  sloganEn: "Designed in Aotearoa | Colored for every loyal companion.",
  positioning: "源自新西兰·治愈系色彩宠物原创设计品牌…",
  personality: ["温柔治愈", "真诚纯粹", "鲜活多彩", "干净高级", "有故事感"],
  story,
  storyParagraphs: story.split("\n"),
} as const;

/** Excerpts must be contiguous, unchanged parts of the approved source. */
export function brandExcerpt(excerpt: string): string {
  if (!story.includes(excerpt)) throw new Error("Brand copy must match the approved source verbatim.");
  return excerpt;
}
