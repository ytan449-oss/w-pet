import { OrderSuccessPageContent } from "@/components/order-success-page";
import { getDictionary, requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  return pageMetadata(locale, getDictionary(locale).pages.success, "order-success");
}
export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return <OrderSuccessPageContent locale={locale} />;
}
