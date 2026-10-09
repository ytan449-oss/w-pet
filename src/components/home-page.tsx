import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, FlowerIcon, HeartIcon, LeafIcon, PawIcon } from "@/components/icons";
import { catalog, formatPrice } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";

export async function HomePage({ locale }: { locale: Locale }) {
  const d = getDictionary(locale).home;
  const products = await catalog.getProducts("aotearoa-bloom");
  const collectionPath = localePath(locale, "collections/aotearoa-bloom");

  return <>
    <section className="hero page-width" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{d.eyebrow}</p>
        <h1 className="hero-heading" id="hero-title"><span>{d.titleFirst}</span><span className="accent">{d.titleSecond}</span></h1>
        <p className="hero-description">{d.description}</p>
        <div className="hero-actions">
          <Link href={collectionPath} className="button-primary">{d.shop}<ArrowIcon className="h-5 w-5" /></Link>
          <Link href={localePath(locale, "our-story")} className="text-link">{d.story}</Link>
        </div>
        <a href="#collection" className="hero-note"><span className="scroll-arrow" aria-hidden="true">↓</span>{d.scroll}</a>
      </div>
      <figure className="hero-photo">
        <div className="hero-photo-frame"><Image src="/images/w-pet-meadow.webp" alt={d.heroAlt} fill priority sizes="(min-width: 1024px) 510px, (min-width: 640px) 560px, calc(100vw - 52px)" /></div>
        <FlowerIcon className="hero-flower" />
        <div className="hero-stamp" aria-hidden="true"><LeafIcon className="h-7 w-7" /><span>{d.stamp}</span></div>
        <figcaption className="hero-photo-caption"><span>{d.photoCaption}</span><span>{d.photoNote}</span></figcaption>
      </figure>
    </section>

    <div className="brand-notes"><div className="page-width">
      <p className="brand-note"><LeafIcon />{d.featureOne}</p>
      <p className="brand-note"><FlowerIcon />{d.featureTwo}</p>
      <p className="brand-note"><HeartIcon />{d.featureThree}</p>
    </div></div>

    <section id="collection" className="collection-section page-width" aria-labelledby="collection-title">
      <div className="section-heading">
        <div><p className="eyebrow">{d.collectionEyebrow}</p><h2 className="section-title" id="collection-title">{d.collectionTitle}<em>{d.collectionTitleAccent}</em></h2></div>
        <div><p className="section-description">{d.collectionDescription}</p><Link href={collectionPath} className="text-link mt-4">{d.allProducts}<ArrowIcon className="h-4 w-4" /></Link></div>
      </div>
      <div className="product-grid">
        {products.map((product, index) => <article key={product.id}>
          <Link className="product-visual" href={localePath(locale, `products/${product.slug}`)} aria-label={`${d.productDetails}: ${product.name[locale]} — ${product.color[locale]}`}>
            <span className="product-index">0{index + 1} / {d.productLabel}</span>
            <Image src={product.image} alt={product.imageAlt[locale]} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 30vw, calc(100vw - 40px)" />
            <span className="product-arrow" aria-hidden="true"><ArrowIcon className="h-4 w-4" /></span>
          </Link>
          <div className="product-name-row"><h3><Link href={localePath(locale, `products/${product.slug}`)}>{product.name[locale]}</Link></h3><p>{formatPrice(product.priceMinor, locale, product.currency)}</p></div>
          <p className="product-color"><span className={`color-dot color-dot-${index}`} aria-hidden="true" />{product.color[locale]}</p>
        </article>)}
      </div>
      <p className="preview-note">{d.preview}</p>
    </section>

    <section className="story-section" aria-labelledby="story-title"><div className="story-inner page-width">
      <div className="story-art"><Image src="/images/botanical-garden.svg" alt="" width={360} height={380} className="botanical-illustration" /><p className="story-art-note">{locale === "en" ? "A little nature, a lot of love." : "一点自然，满满的爱。"}</p></div>
      <div><p className="eyebrow">{d.storyEyebrow}</p><h2 className="section-title" id="story-title">{d.storyTitle}<em>{d.storyTitleAccent}</em></h2><p className="story-body">{d.storyBody}</p><Link href={localePath(locale, "our-story")} className="text-link mt-6">{d.storyLink}<ArrowIcon className="h-4 w-4" /></Link></div>
    </div></section>

    <section className="details-section page-width" aria-labelledby="details-title">
      <div><p className="eyebrow">{d.craftEyebrow}</p><h2 className="details-title" id="details-title">{d.craftTitle}</h2><p className="section-description">{d.craftDescription}</p></div>
      <article className="detail-item"><LeafIcon /><div><h3>{d.craftLink}</h3><p>{d.craftText}</p><Link href={localePath(locale, "craftsmanship")} className="text-link">{getDictionary(locale).site.craft}<ArrowIcon className="h-4 w-4" /></Link></div></article>
      <article className="detail-item"><PawIcon /><div><h3>{d.careLink}</h3><p>{d.careText}</p><Link href={localePath(locale, "care-faq")} className="text-link">{getDictionary(locale).site.care}<ArrowIcon className="h-4 w-4" /></Link></div></article>
    </section>

    <section className="contact-section" aria-labelledby="contact-title"><div className="page-width">
      <FlowerIcon className="mx-auto mb-5 h-9 w-9 text-sage" />
      <p className="eyebrow">{d.contactEyebrow}</p><h2 className="section-title" id="contact-title">{d.contactTitle}</h2><p className="text-sm leading-7 text-muted">{d.contactText}</p>
      <Link href={localePath(locale, "contact")} className="button-primary">{d.contactLink}<ArrowIcon className="h-5 w-5" /></Link>
    </div></section>
  </>;
}
