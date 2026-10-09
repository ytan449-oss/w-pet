import { CraftPage } from "@/components/craft-page";
import { getDictionary, requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  return pageMetadata(locale, getDictionary(locale).pages.craft, "craftsmanship");
}
export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return <CraftPage locale={locale} />;
}
