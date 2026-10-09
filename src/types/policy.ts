import type { ContactTopic } from "../config/contact";
import type { LocalizedText } from "./catalog";

export interface PolicySection {
  id: string;
  heading: LocalizedText;
  paragraphs: { en: readonly string[]; zh: readonly string[] };
  links?: readonly { href: string; label: LocalizedText }[];
  contactTopic?: ContactTopic;
}
export interface Policy {
  slug: "privacy" | "terms";
  title: LocalizedText;
  intro: LocalizedText;
  updated: string;
  notice: LocalizedText;
  sections: readonly PolicySection[];
}
