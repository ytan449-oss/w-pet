import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/types/catalog";

export function SiteShell({ children, locale }: { children: ReactNode; locale: Locale }) {
  return <>
    <a className="skip-link" href="#main-content">{getDictionary(locale).site.skip}</a>
    <SiteHeader locale={locale} />
    <main id="main-content" tabIndex={-1}>{children}</main>
    <SiteFooter locale={locale} />
  </>;
}
