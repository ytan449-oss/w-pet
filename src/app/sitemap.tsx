import type { MetadataRoute } from "next";
import { products } from "@/config/products";
import { localePath, pageRoutes } from "@/lib/routing";
import { siteOrigin } from "@/lib/site-origin";
import { locales } from "@/types/catalog";

export const dynamic = "force-static";
const privateRoutes = new Set<string>(["cart", "checkout", "order-success"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const routes = [...pageRoutes.filter(path => !privateRoutes.has(path)), ...products.map(product => `products/${product.slug}`)];
  return routes.flatMap(path => locales.map(locale => ({
    url: `${origin}${localePath(locale, path)}`,
    alternates: { languages: {
      "en-NZ": `${origin}${localePath("en", path)}`,
      "zh-CN": `${origin}${localePath("zh", path)}`,
      "x-default": `${origin}${localePath("en", path)}`,
    } },
  })));
}
