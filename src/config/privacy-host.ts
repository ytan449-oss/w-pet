import { privacyPolicy } from "./privacy";
import type { Policy } from "../types/policy";

/** Hosting disclosure for the native preview; approved brand copy is not changed. */
export function privacyPolicyForHost(target = process.env.WPET_BUILD_TARGET || (process.env.VERCEL === "1" ? "vercel" : undefined)): Policy {
  if (target !== "vercel") return privacyPolicy;
  return {
    ...privacyPolicy,
    sections: privacyPolicy.sections.map(section => {
      if (section.id === "scope") return { ...section, paragraphs: {
        en: ["This notice describes the W Pet Vercel preview and its enquiry form. The preview does not accept retail orders or arrange shipments. Its access is controlled by the owner's Vercel deployment settings.", ...section.paragraphs.en.slice(1)],
        zh: ["本说明适用于 W Pet 的 Vercel 测试预览及咨询表单。测试预览不接受正式零售订单，也不安排发货；访问范围由站点所有者的 Vercel 部署设置控制。", ...section.paragraphs.zh.slice(1)],
      } };
      if (section.id === "storage") return { ...section, paragraphs: {
        en: ["Vercel hosts this preview and its enquiry API. When configured, enquiries are saved to the owner's Cloudflare D1 database through a server-side connection. The form remains unavailable until its database and signing configuration are supplied. Vercel and Cloudflare may maintain their own access and network logs. A New Zealand-only data-residency arrangement has not been selected; do not assume all processing stays in New Zealand.", ...section.paragraphs.en.slice(1)],
        zh: ["本测试预览及咨询接口由 Vercel 托管。完成配置后，咨询通过服务器连接保存到站点所有者的 Cloudflare D1 数据库；数据库及签名配置未提供时，表单保持不可用。Vercel 与 Cloudflare 可能保留各自的访问和网络日志。目前未选择仅在新西兰处理数据的安排，请勿假定所有处理均发生在新西兰。", ...section.paragraphs.zh.slice(1)],
      } };
      return section;
    }),
  };
}
