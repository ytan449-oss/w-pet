import { locales, type Locale } from "../types/catalog";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function localePath(locale: Locale, path = "") {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

/** Change only a supported leading locale; preserve the route and URL suffix. */
export function switchLocalePath(path: string, locale: Locale) {
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match?.[1] ?? "/";
  const suffix = match?.[2] ?? "";
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) segments.shift();
  return localePath(locale, segments.join("/")) + suffix;
}

export const pageRoutes = [
  "",
  "collections/aotearoa-bloom",
  "our-story",
  "craftsmanship",
  "care-faq",
  "contact",
  "cart",
  "checkout",
  "order-success",
  "privacy",
  "terms",
] as const;
