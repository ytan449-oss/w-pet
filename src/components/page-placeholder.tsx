import Link from "next/link";
import { ArrowIcon, FlowerIcon } from "@/components/icons";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";

export function PagePlaceholder({ locale, title, description, commerce = false }: { locale: Locale; title: string; description?: string; commerce?: boolean }) {
  const d = getDictionary(locale).placeholder;
  return <section className="placeholder page-width">
    <FlowerIcon className="mx-auto mb-8 h-16 w-16 text-rose" />
    <p className="eyebrow mb-5">{d.eyebrow}</p>
    <h1>{title}</h1>
    <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-muted">{description ?? d.body}</p>
    <div className="mt-9 flex flex-wrap justify-center gap-4">
      <Link href={localePath(locale)} className="button-primary">{d.home}<ArrowIcon className="h-5 w-5" /></Link>
      <Link href={localePath(locale, "collections/aotearoa-bloom")} className="button-secondary">{d.collection}</Link>
    </div>
    {commerce && <p className="mx-auto mt-8 max-w-lg rounded-lg bg-sage/10 px-5 py-4 text-sm text-ink">{d.preview}</p>}
  </section>;
}
