import Link from "next/link";
import { FlowerIcon } from "@/components/icons";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = getDictionary(locale).site;
  return <footer className="site-footer">
    <div className="page-width footer-grid">
      <div>
        <Link href={localePath(locale)} className="wordmark footer-wordmark">W <span>Pet</span><i aria-hidden="true">✳</i></Link>
        <p className="footer-tagline">{d.footerTagline}</p>
        <p className="max-w-80 text-sm leading-7 text-muted">{d.footerDescription}</p>
      </div>
      <nav aria-label={d.explore}>
        <h2 className="footer-heading">{d.explore}</h2>
        <Link href={localePath(locale, "collections/aotearoa-bloom")}>{d.collection}</Link>
        <Link href={localePath(locale, "our-story")}>{d.story}</Link>
        <Link href={localePath(locale, "craftsmanship")}>{d.craft}</Link>
      </nav>
      <nav aria-label={d.helpful}>
        <h2 className="footer-heading">{d.helpful}</h2>
        <Link href={localePath(locale, "care-faq")}>{d.care}</Link>
        <Link href={localePath(locale, "contact")}>{d.contact}</Link>
        <Link href={localePath(locale, "privacy")}>{d.privacy}</Link>
        <Link href={localePath(locale, "terms")}>{d.terms}</Link>
      </nav>
      <div className="footer-flower"><FlowerIcon className="h-18 w-18 text-rose" /><p>{d.origin}</p></div>
    </div>
    <div className="page-width footer-bottom"><p>© {new Date().getFullYear()} {d.copyright}</p><p>Aotearoa · New Zealand</p></div>
  </footer>;
}
