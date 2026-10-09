import { CartPageContent } from "@/components/cart-page";
import { getDictionary, requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  return pageMetadata(locale, getDictionary(locale).pages.cart, "cart");
}
export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return <CartPageContent locale={locale} />;
}
