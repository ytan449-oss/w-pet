import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { brand } from "@/config/brand";
import { brandFaqs, careInformation } from "@/config/care-faq";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";
import styles from "@/components/brand-pages.module.css";

export function CareFaqPage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <div className={styles.page}>
    <section className={`${styles.faqHero} page-width`} aria-labelledby="care-title">
      <p className={styles.kicker}>W Pet · Aotearoa</p>
      <h1 className={styles.title} id="care-title">{zh ? "养护与 FAQ" : "Care & FAQ"}</h1>
      <p className={styles.slogan} lang="en-NZ">{brand.sloganEn}</p>
      <p className={styles.sloganZh} lang="zh-CN">{brand.sloganZh}</p>
      <nav className={styles.topicNavigation} aria-label={zh ? "本页导航" : "On this page"}>
        <a href="#product-care">{zh ? "产品养护" : "Product care"}</a>
        <a href="#brand-faq">{zh ? "品牌 FAQ" : "Brand FAQ"}</a>
      </nav>
    </section>
    <section className={styles.careSection} id="product-care" aria-labelledby="product-care-heading">
      <div className={`${styles.careInner} page-width`}>
        <div><p className={styles.kicker}>{zh ? "产品养护" : "Product care"}</p><h2 className={styles.sectionTitle} id="product-care-heading">{zh ? "养护说明" : "Care instructions"}</h2></div>
        <div className={styles.careState} data-care-status={careInformation.status}>
          <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.4" aria-hidden="true"><path d="M11 6h13l6 6v22H11V6Z" /><path d="M24 6v7h6M16 20h9m-9 6h9" strokeLinecap="round" /></svg>
          <div><h3>{zh ? "待补充" : "Coming soon"}</h3><p>{zh ? "养护说明待补充。" : "Care instructions coming soon."}</p></div>
        </div>
      </div>
    </section>
    <section className={`${styles.faqSection} page-width`} id="brand-faq" aria-labelledby="brand-faq-heading">
      <div><p className={styles.kicker}>FAQ</p><h2 className={styles.sectionTitle} id="brand-faq-heading">{zh ? "品牌 FAQ" : "Brand FAQ"}</h2></div>
      <div className={styles.faqList}>
        {brandFaqs.map((faq) => <details className={styles.faqItem} key={faq.id} id={`faq-${faq.id}`} name="brand-faq">
          <summary>{faq.question[locale]}</summary>
          <p className={styles.faqAnswer} lang="en-NZ" data-brand-excerpt>{faq.answer}</p>
        </details>)}
      </div>
    </section>
    <nav className={`${styles.closing} page-width`} aria-label={zh ? "相关页面" : "Related pages"}>
      <p lang="zh-CN">{brand.sloganZh}</p>
      <div className={styles.faqRelated}>
        <Link href={localePath(locale, "our-story")} className="text-link">{zh ? "品牌故事" : "About"}<ArrowIcon className="h-4 w-4" /></Link>
        <Link href={localePath(locale, "craftsmanship")} className="text-link">{zh ? "我们的工艺" : "Our Craft"}<ArrowIcon className="h-4 w-4" /></Link>
      </div>
    </nav>
  </div>;
}
