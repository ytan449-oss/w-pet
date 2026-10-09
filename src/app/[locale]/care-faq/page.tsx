import { CareFaqPage } from "@/components/care-faq-page";
import { brand } from "@/config/brand";
import { getDictionary, requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  return pageMetadata(locale, getDictionary(locale).pages.care, "care-faq", brand.slogan);
}
export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return <CareFaqPage locale={locale} />;
}
