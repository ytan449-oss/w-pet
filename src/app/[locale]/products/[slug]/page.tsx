import { notFound } from "next/navigation";
import { PagePlaceholder } from "@/components/page-placeholder";
import { products } from "@/config/products";
import { catalog } from "@/lib/catalog";
import { getDictionary, requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  const { slug } = await params;
  const product = await catalog.getProduct(slug);
  if (!product) notFound();
  return pageMetadata(locale, `${product.name[locale]} — ${product.color[locale]}`, `products/${slug}`);
}
export default async function ProductPage({ params }: Props) {
  const locale = await requireLocale(params);
  const { slug } = await params;
  const product = await catalog.getProduct(slug);
  if (!product) notFound();
  return <PagePlaceholder locale={locale} title={`${product.name[locale]} — ${product.color[locale]}`} description={getDictionary(locale).placeholder.productBody} />;
}
