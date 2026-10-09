import { PagePlaceholder } from "@/components/page-placeholder";
import { getDictionary, requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  return pageMetadata(locale, getDictionary(locale).pages.collection, "collections/aotearoa-bloom");
}
export default async function CollectionPage({ params }: Props) {
  const locale = await requireLocale(params);
  const d = getDictionary(locale);
  return <PagePlaceholder locale={locale} title={d.pages.collection} description={d.placeholder.collectionBody} />;
}
