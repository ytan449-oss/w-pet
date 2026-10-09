import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { brand } from "@/config/brand";
import { brandFaqs, careInformation, productFaqs } from "@/config/care-faq";
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
        <a href="#product-faq">{zh ? "牵引绳 FAQ" : "Leash FAQ"}</a>
        <a href="#brand-faq">{zh ? "品牌 FAQ" : "Brand FAQ"}</a>
      </nav>
    </section>
    <section className={styles.careSection} id="product-care" aria-labelledby="product-care-heading">
      <div className={`${styles.careInner} page-width`}>
        <div><p className={styles.kicker}>{zh ? "产品养护" : "Product care"}</p><h2 className={styles.sectionTitle} id="product-care-heading">{zh ? "养护说明" : "Care instructions"}</h2></div>
        <div className={styles.careState} data-care-status={careInformation.status}>
          <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.4" aria-hidden="true"><path d="M11 6h13l6 6v22H11V6Z" /><path d="M24 6v7h6M16 20h9m-9 6h9" strokeLinecap="round" /></svg>
          <div><h3>{zh ? "官方说明待确认" : "Official guidance awaiting confirmation"}</h3><p>{zh ? "官方清洗与存放说明尚未提供。下方 FAQ 展示已提供的产品资料；具体养护方法请通过联系页咨询。" : "Official washing and storage instructions have not been supplied. The FAQs below show the provided product information; ask us about specific care methods."}</p><Link href={`${localePath(locale, "contact")}?topic=product-care`} className="text-link mt-5">{zh ? "咨询产品养护" : "Ask about product care"}<ArrowIcon className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </section>
    <section className={`${styles.faqSection} page-width`} id="product-faq" aria-labelledby="product-faq-heading">
      <div><p className={styles.kicker}>Aotearoa Bloom</p><h2 className={styles.sectionTitle} id="product-faq-heading">{zh ? "牵引绳 FAQ" : "Leash FAQ"}</h2><Link className="text-link mt-6" href={localePath(locale, "products/aotearoa-bloom-hand-woven-dog-leash")}>{zh ? "查看完整规格" : "View the full specifications"}<ArrowIcon className="h-4 w-4" /></Link></div>
      <div className={styles.faqList}>
        {productFaqs.map(faq => <details className={styles.faqItem} key={faq.id} id={`product-faq-${faq.id}`} name="product-faq"><summary>{faq.question[locale]}</summary><p className={styles.faqAnswer} data-product-spec={faq.id}>{faq.answer[locale]}</p></details>)}
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
