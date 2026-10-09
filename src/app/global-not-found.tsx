import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | W Pet",
  description: "This W Pet page could not be found. Return to the English or Chinese storefront.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return <html lang="en-NZ"><body style={{ background: "#fbf8f1", color: "#365d82", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "20vh 24px" }}><h1>A little off the beaten path.</h1><p>We could not find that page.</p><p lang="zh-CN">找不到此页面，请返回 W Pet。</p><nav aria-label="Return to W Pet"><Link href="/en/" style={{ display: "inline-block", padding: "16px" }}>Back to W Pet · EN</Link><Link href="/zh/" lang="zh-CN" style={{ display: "inline-block", padding: "16px" }}>返回 W Pet · 中文</Link></nav></body></html>;
}
