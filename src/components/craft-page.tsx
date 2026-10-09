import Link from "next/link";
import { ArrowIcon, FlowerIcon, HeartIcon, LeafIcon } from "@/components/icons";
import { WeaveIllustration } from "@/components/brand-illustrations";
import { brand } from "@/config/brand";
import { craft } from "@/config/craft";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";
import styles from "@/components/brand-pages.module.css";

export function CraftPage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <div className={styles.page}>
    <section className={`${styles.hero} page-width`} aria-labelledby="craft-title">
      <div>
        <p className={styles.kicker}>W Pet · Aotearoa</p>
        <h1 className={styles.title} id="craft-title">{zh ? "我们的工艺" : "Our Craft"}</h1>
        <p className={styles.slogan} lang="zh-CN">{brand.sloganZh}</p>
        <p className={styles.sloganZh} lang="en-NZ">{brand.sloganEn}</p>
        <div className={styles.heroLinks}>
          <a href="#craft-philosophy" className="text-link">{zh ? "设计理念" : "Design philosophy"}<ArrowIcon className="h-4 w-4" /></a>
          <Link href={localePath(locale, "our-story")} className="text-link">{zh ? "品牌故事" : "About"}<ArrowIcon className="h-4 w-4" /></Link>
        </div>
      </div>
      <div className={styles.heroArt}><WeaveIllustration /></div>
    </section>
    <section className={styles.craftPhilosophy} id="craft-philosophy" aria-labelledby="philosophy-heading">
      <div className="page-width"><div className={styles.craftPhilosophyInner}>
        <h2 className={styles.kicker} id="philosophy-heading">{zh ? "设计理念" : "Design philosophy"}</h2>
        <p className={styles.sourceQuote} lang="en-NZ" data-brand-excerpt>{craft.philosophy}</p>
      </div></div>
    </section>
    <section className={`${styles.craftDetails} page-width`} aria-labelledby="craft-details-heading">
      <div><p className={styles.kicker}>{zh ? "设计与工艺" : "Design & craft"}</p><h2 className={styles.sectionTitle} id="craft-details-heading">{zh ? "我们的工艺" : "Our Craft"}</h2></div>
      <p className={styles.craftSource} lang="en-NZ" data-brand-excerpt>{craft.design}</p>
    </section>
    <ul className={`${styles.craftLabels} page-width`} lang="en-NZ">
      <li><FlowerIcon /><span data-brand-excerpt>healing dopamine color palettes</span></li>
      <li><LeafIcon /><span data-brand-excerpt>exquisite hand-woven craftsmanship</span></li>
      <li><HeartIcon /><span data-brand-excerpt>reliable safety quality</span></li>
    </ul>
    <section className={`${styles.devotion} page-width`} aria-label={zh ? "品牌理念" : "Brand philosophy"}>
      <p lang="en-NZ" data-brand-excerpt>{craft.devotion}</p>
    </section>
    <nav className={`${styles.closing} page-width`} aria-label={zh ? "相关页面" : "Related pages"}>
      <p lang="zh-CN">{brand.sloganZh}</p>
      <Link href={localePath(locale, "care-faq")} className="button-primary">{zh ? "养护与 FAQ" : "Care & FAQ"}<ArrowIcon className="h-5 w-5" /></Link>
    </nav>
  </div>;
}
