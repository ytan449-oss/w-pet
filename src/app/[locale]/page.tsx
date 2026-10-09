import { PagePlaceholder } from "@/components/page-placeholder";
import { requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  return pageMetadata(locale, locale === "en" ? "An original New Zealand pet brand" : "新西兰原创宠物品牌");
}
export default async function Home({ params }: Props) {
  const locale = await requireLocale(params);
  return <PagePlaceholder locale={locale} title="W Pet" />;
}
