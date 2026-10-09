import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { CompanionIllustration } from "@/components/brand-illustrations";
import { brand } from "@/config/brand";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";
import styles from "@/components/brand-pages.module.css";

export function AboutPage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return <div className={styles.page}>
    <section className={`${styles.hero} page-width`} aria-labelledby="about-title">
      <div>
        <p className={styles.kicker}>W Pet · Aotearoa</p>
        <h1 className={styles.title} id="about-title">{zh ? "品牌故事" : "About W Pet"}</h1>
        <p className={styles.slogan} lang="en-NZ">{brand.sloganEn}</p>
        <p className={styles.sloganZh} lang="zh-CN">{brand.sloganZh}</p>
        <div className={styles.heroLinks}>
          <a href="#brand-story" className="text-link">{zh ? "品牌故事" : "Brand story"}<ArrowIcon className="h-4 w-4" /></a>
          <Link href={localePath(locale, "craftsmanship")} className="text-link">{zh ? "我们的工艺" : "Our Craft"}<ArrowIcon className="h-4 w-4" /></Link>
        </div>
      </div>
      <div className={styles.heroArt}><CompanionIllustration /></div>
    </section>
    <section className={`${styles.story} page-width`} id="brand-story" aria-labelledby="story-heading">
      <div className={styles.storyHeading}>
        <p className={styles.kicker}>{zh ? "品牌故事" : "Brand story"}</p>
        <h2 className={styles.sectionTitle} id="story-heading" lang="en">Aria &amp; Wellness</h2>
      </div>
      <div className={styles.storyCopy} lang="en-NZ" data-brand-story>
        {brand.storyParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </section>
    <section className={styles.positioning} aria-labelledby="positioning-heading">
      <div className={`${styles.positioningInner} page-width`}>
        <h2 className={styles.kicker} id="positioning-heading">{zh ? "品牌定位" : "Brand positioning"}</h2>
        <p className={styles.positioningText} lang="zh-CN" data-brand-positioning>{brand.positioning}</p>
      </div>
    </section>
    <section className={`${styles.personality} page-width`} aria-labelledby="personality-heading">
      <h2 className={styles.kicker} id="personality-heading">{zh ? "品牌人格" : "Brand personality"}</h2>
      <ul className={styles.personalityList} lang="zh-CN">{brand.personality.map((word) => <li key={word}>{word}</li>)}</ul>
    </section>
    <nav className={`${styles.closing} page-width`} aria-label={zh ? "相关页面" : "Related pages"}>
      <p lang="zh-CN">{brand.sloganZh}</p>
      <Link href={localePath(locale, "craftsmanship")} className="button-primary">{zh ? "我们的工艺" : "Our Craft"}<ArrowIcon className="h-5 w-5" /></Link>
    </nav>
  </div>;
}
