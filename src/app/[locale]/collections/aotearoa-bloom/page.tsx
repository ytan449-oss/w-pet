import { CollectionPageContent } from "@/components/collection-page";
import { catalog } from "@/lib/catalog";
import { getDictionary, requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  return pageMetadata(locale, getDictionary(locale).pages.collection, "collections/aotearoa-bloom");
}
export default async function CollectionPage({ params }: Props) {
  const locale = await requireLocale(params);
  return <CollectionPageContent locale={locale} products={await catalog.getProducts("aotearoa-bloom")} />;
}
