"use client";

import { usePathname } from "next/navigation";
import { PagePlaceholder } from "@/components/page-placeholder";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const locale = usePathname().split("/")[1] === "zh" ? "zh" : "en";
  const d = getDictionary(locale).placeholder;
  return <PagePlaceholder locale={locale} title={d.notFoundTitle} description={d.notFoundBody} />;
}
