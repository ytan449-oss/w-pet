import { brand, brandExcerpt } from "./brand";
import type { LocalizedText } from "../types/catalog";

/** Approved brand excerpts stay verbatim. Utility-page descriptions describe actual behaviour. */
export const pageDescriptions: Record<string, LocalizedText> = {
  "": {
    en: "W Pet is an original New Zealand pet brand. Discover the Aotearoa Bloom Collection.",
    zh: `${brand.positioning}${brand.sloganZh}`,
  },
  "collections/aotearoa-bloom": {
    en: "Aotearoa Bloom Collection · Aotearoa Bloom Hand-Woven Dog Leash · Pink Mint Haze · small-batch custom colours available.",
    zh: "Aotearoa Bloom 花卉系列 · Aotearoa Bloom 手工编织狗牵引绳 · Pink Mint Haze；支持小批量定制配色。",
  },
  "our-story": {
    en: brandExcerpt("W Pet was born from a tender twelve-year companionship and a heartfelt regret."),
    zh: `${brand.positioning}${brand.personality.join("、")}`,
  },
  "craftsmanship": {
    en: brandExcerpt("With healing dopamine color palettes, exquisite hand-woven craftsmanship and reliable safety quality, we create premium pet gear rooted in local Kiwi aesthetics and outdoor lifestyles."),
    zh: `${brand.sloganZh}${brand.personality.join("、")}`,
  },
  "care-faq": {
    en: "W Pet Care & FAQ: approved leash specifications and brand answers, with a contact route for official washing and storage guidance.",
    zh: "W Pet 养护与 FAQ：查看已提供的牵引绳规格、品牌问答，并通过联系页咨询尚待确认的官方清洗与存放说明。",
  },
  "contact": {
    en: "Contact W Pet about product care, small-batch custom colours, test checkout or privacy. Save an enquiry and keep its reference for follow-up.",
    zh: "联系 W Pet，咨询产品养护、小批量定制配色、测试支付或隐私请求。提交咨询后保留已保存的咨询编号，便于后续联系。",
  },
  "cart": {
    en: "Review W Pet leash variants, update quantities and continue to sandbox checkout. The NZD test amount is separate from the unconfirmed retail price.",
    zh: "查看 W Pet 牵引绳规格、修改数量并前往支付沙箱。页面显示的 NZD 测试金额独立于尚未确认的正式售价。",
  },
  "checkout": {
    en: "W Pet sandbox checkout for Stripe Checkout and PayPal. Available test methods depend on merchant configuration; no retail order is created.",
    zh: "W Pet 支付沙箱：Stripe Checkout 与 PayPal 测试方式依商户配置开放。本流程仅供测试，不创建正式零售订单。",
  },
  "order-success": {
    en: "Check a W Pet sandbox payment result. The server verifies the provider reference, test status, NZD amount and currency before confirming payment.",
    zh: "查看 W Pet 支付沙箱结果。服务器核验支付平台交易编号、测试状态、NZD 金额与币种后，才确认测试支付成功。",
  },
  "privacy": {
    en: "W Pet preview privacy notice: enquiry information, hosted storage, browser cart data, sandbox providers and access or correction requests.",
    zh: "W Pet 测试站隐私说明：咨询信息、托管保存、浏览器购物车数据、支付沙箱平台，以及访问、更正与删除申请方式。",
  },
  "terms": {
    en: "W Pet preview terms covering product information, sandbox amounts, custom-colour enquiries and the retail delivery and return arrangements awaiting confirmation.",
    zh: "W Pet 测试站条款：产品资料、沙箱金额、定制配色咨询，以及正式销售前尚待确认的配送与退换安排。",
  },
};
