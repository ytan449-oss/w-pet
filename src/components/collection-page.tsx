import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { brand } from "@/config/brand";
import { conceptLabel, retailPriceLabel, versionLabel } from "@/lib/product";
import { localePath } from "@/lib/routing";
import type { Locale, Product } from "@/types/catalog";
import styles from "@/components/shop.module.css";

export function CollectionPageContent({ locale, products }: { locale: Locale; products: readonly Product[] }) {
  const zh = locale === "zh";
  return <div className={styles.page}>
    <section className={`${styles.hero} page-width`} aria-labelledby="collection-title">
      <p className={styles.kicker}>W Pet · Aotearoa</p>
      <h1 className={styles.title} id="collection-title">{zh ? "Aotearoa Bloom 花卉系列" : "Aotearoa Bloom Collection"}</h1>
      <p className={styles.intro} lang={zh ? "zh-CN" : "en-NZ"}>{zh ? brand.sloganZh : brand.sloganEn}</p>
    </section>
    <section className={`${styles.collection} page-width`} aria-label={zh ? "产品列表" : "Products"}>
      <div className={styles.collectionMeta}><p>{zh ? `${products.length} 款产品` : `${products.length} product`}</p><p>{zh ? "手工编织狗牵引绳" : "Hand-woven dog leash"}</p></div>
      {products.map(product => <article className={styles.productCard} key={product.id}>
        <figure><Link href={localePath(locale, `products/${product.slug}`)} className={styles.photo} style={{display:"block"}} aria-label={product.name[locale]}>
          <Image src={product.image} alt={product.imageAlt[locale]} fill priority sizes="(min-width: 1024px) 580px, (min-width: 768px) 48vw, calc(100vw - 40px)" />
        </Link><figcaption className={styles.imageLabel}>{conceptLabel(locale)}</figcaption></figure>
        <div>
          <h2 className={styles.productTitle}><Link href={localePath(locale, `products/${product.slug}`)}>{product.name[locale]}</Link></h2>
          <p className={styles.description}>{product.description[locale]}</p>
          <p className={styles.pricePending}>{retailPriceLabel(locale)}</p>
          <p className={styles.colorLine}><span className={styles.colorSwatch} style={{background:"linear-gradient(135deg, #f2b8c0 50%, #b8dacf 50%)"}} aria-hidden="true" />Pink Mint Haze</p>
          <div className={styles.versions}>
            {(["standard", "lightweight"] as const).map(version => <Link key={version} className={styles.versionLink} href={`${localePath(locale, `products/${product.slug}`)}?version=${version}`}>
              <span>{versionLabel(version, locale)}</span><small>{zh ? "断裂载荷" : "Breaking load"} {version === "standard" ? "400kg" : "200kg"}</small>
            </Link>)}
          </div>
          <div className={styles.factLine}><span>1.2m / 2m</span><span>{zh ? "支持小批量定制配色" : "Small-batch custom colours"}</span></div>
          <Link className="button-primary" href={localePath(locale, `products/${product.slug}`)}>{zh ? "查看产品" : "View product"}<ArrowIcon className="h-5 w-5" /></Link>
        </div>
      </article>)}
    </section>
    <section className={styles.customSection} aria-labelledby="collection-colour-heading"><div className={`${styles.customInner} page-width`}>
      <h2 className={styles.sectionTitle} id="collection-colour-heading">{zh ? "定制配色" : "Custom colours"}</h2>
      <div className={styles.copy}><p>{zh ? "支持小批量定制配色。" : "Small-batch custom colours are available."}</p><Link href={localePath(locale, "contact")} className="text-link mt-5">{zh ? "联系 W Pet" : "Contact W Pet"}<ArrowIcon className="h-4 w-4" /></Link></div>
    </div></section>
  </div>;
}
