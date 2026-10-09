import type { LocalizedText } from "../types/catalog";

export const contactTopics = [
  { id: "general", label: { en: "General enquiry", zh: "一般咨询" } },
  { id: "custom-colours", label: { en: "Small-batch custom colours", zh: "小批量定制配色" } },
  { id: "product-care", label: { en: "Product & care questions", zh: "产品与养护咨询" } },
  { id: "test-checkout", label: { en: "Test checkout support", zh: "测试支付咨询" } },
  { id: "privacy", label: { en: "Privacy request", zh: "隐私请求" } },
] as const satisfies readonly { id: string; label: LocalizedText }[];
export type ContactTopic = typeof contactTopics[number]["id"];
export const contactNoticeVersion = "2026-10-10";
export const isContactTopic = (value: unknown): value is ContactTopic => contactTopics.some(topic => topic.id === value);
