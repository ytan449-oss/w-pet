import { PolicyPage } from "@/components/policy-page";
import { privacyPolicy } from "@/config/privacy";
import { getDictionary, requireLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props) {
  const locale = await requireLocale(params);
  return pageMetadata(locale, getDictionary(locale).pages.privacy, "privacy");
}
export default async function Page({ params }: Props) {
  const locale = await requireLocale(params);
  return <PolicyPage locale={locale} policy={privacyPolicy} />;
}
