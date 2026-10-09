"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { conceptLabel, lengthLabel, retailPriceLabel, versionLabel } from "@/lib/product";
import { localePath } from "@/lib/routing";
import type { Locale, Product, ProductVariant } from "@/types/catalog";
import styles from "@/components/shop.module.css";

export function ProductDetail({ locale, product }: { locale: Locale; product: Product }) {
  const zh = locale === "zh";
  const [view, setView] = useState(0);
  const [version, setVersion] = useState<ProductVariant["version"]>("standard");
  const [lengthCm, setLengthCm] = useState<120 | 200>(120);
  const [colorId, setColorId] = useState(product.colors[0].id);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setVersion(query.get("version") === "lightweight" ? "lightweight" : "standard");
    setLengthCm(query.get("length") === "200" ? 200 : 120);
    const colour = query.get("colour");
    setColorId(product.colors.some(value => value.id === colour) ? colour! : product.colors[0].id);
  }, [locale, product]);
  function selectOption(key: "version" | "length" | "colour", value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    setMessage("");
  }
  const variant = product.variants.find(v => v.version === version && v.lengthCm === lengthCm && v.colorId === colorId)!;
  const image = product.gallery[view];
  const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 10;
  const verified = product.certification.status === "verified" && !!product.certification.reportUrl;
  return <div className={styles.page}>
    <nav className={`${styles.breadcrumb} page-width`} aria-label={zh ? "面包屑导航" : "Breadcrumb"}><Link href={localePath(locale, "collections/aotearoa-bloom")}>Aotearoa Bloom</Link><span aria-hidden="true">/</span><span>{zh ? "手工编织狗牵引绳" : "Hand-woven dog leash"}</span></nav>
    <section className={`${styles.productLayout} page-width`} aria-labelledby="product-title">
      <div>
        <figure><div className={styles.photo}><Image key={image.src} src={image.src} alt={image.alt[locale]} fill priority={view === 0} sizes="(min-width: 1024px) 650px, (min-width: 768px) 52vw, calc(100vw - 40px)" /></div><figcaption className={styles.imageLabel}>{image.view[locale]} · {conceptLabel(locale)}</figcaption></figure>
        <div className={styles.thumbnails} role="group" aria-label={zh ? "产品视角选择" : "Product views"}>
          {product.gallery.map((entry, index) => <button key={entry.src} type="button" className={styles.thumbnail} aria-pressed={index === view} aria-label={entry.view[locale]} onClick={() => setView(index)}><Image src={entry.src} alt="" width={150} height={150} /><span>{entry.view[locale]}</span></button>)}
        </div>
      </div>
      <div className={styles.productOptions}>
        <p className={styles.kicker}>W Pet · Aotearoa Bloom</p>
        <h1 className={styles.productTitle} id="product-title">{product.name[locale]}</h1>
        <p className={styles.description}>{product.description[locale]}</p>
        <p className={styles.pricePending}>{retailPriceLabel(locale)}</p>
        <fieldset className={styles.optionGroup}><legend>{zh ? "配色" : "Colour"}</legend><div className={styles.optionButtons}>
          {product.colors.map(color => <label className={styles.colorChoice} key={color.id}><input type="radio" name="colour" value={color.id} checked={colorId === color.id} onChange={() => {setColorId(color.id);selectOption("colour",color.id);}} /><span className={styles.colorSwatch} style={{background:`linear-gradient(135deg, ${color.swatch[0]} 50%, ${color.swatch[1]} 50%)`}} aria-hidden="true" /><span>{color.name[locale]}</span></label>)}
          <a href="#custom-colours" className="text-link">{zh ? "定制配色" : "Custom colours"}</a>
        </div></fieldset>
        <fieldset className={styles.optionGroup}><legend>{zh ? "版本" : "Version"}</legend><div className={styles.optionButtons}>{(["standard", "lightweight"] as const).map(value => <label className={styles.radioChoice} key={value}><input type="radio" name="version" value={value} checked={version === value} onChange={() => {setVersion(value);selectOption("version",value);}} /><span>{versionLabel(value, locale)}</span></label>)}</div></fieldset>
        <fieldset className={styles.optionGroup}><legend>{zh ? "长度" : "Length"}</legend><div className={styles.optionButtons}>{([120, 200] as const).map(value => <label className={styles.radioChoice} key={value}><input type="radio" name="length" value={value} checked={lengthCm === value} onChange={() => {setLengthCm(value);selectOption("length",String(value));}} /><span>{lengthLabel(value)}</span></label>)}</div></fieldset>
        <p className={styles.selectedLoad} aria-live="polite">{versionLabel(version, locale)} · {zh ? "断裂载荷" : "Breaking load"} {variant.breakingLoadKg}kg</p>
        <div className={styles.addRow}><label className={styles.quantityLabel}>{zh ? "数量" : "Quantity"}<input type="number" inputMode="numeric" min={1} max={10} step={1} value={Number.isNaN(quantity) ? "" : quantity} onChange={event => {setQuantity(event.target.valueAsNumber);setMessage("");}} /></label><button type="button" className="button-primary" disabled={!validQuantity} onClick={() => {
          try { addToCart(variant.id, quantity); setMessage(zh ? "已加入测试购物车。" : "Added to your test cart."); }
          catch { setMessage(zh ? "无法保存购物车，请检查数量或浏览器存储设置。" : "Could not save your cart. Check the quantity or browser storage settings."); }
        }}>{zh ? "加入测试购物车" : "Add to test cart"}<ArrowIcon className="h-5 w-5" /></button></div>
        <p className={styles.testNotice}>{zh ? "仅供支付测试，非正式售价：" : "Sandbox amount, not the retail price: "}{formatPrice(product.testUnitAmountMinor, locale)}{zh ? "/件。" : " per unit."}</p>
        <p className={styles.feedback} role="status">{message}</p>
        <Link href={localePath(locale, "cart")} className="text-link">{zh ? "查看购物车" : "View cart"}<ArrowIcon className="h-4 w-4" /></Link>
      </div>
    </section>
    <section className={`${styles.specSection} page-width`} aria-labelledby="spec-heading"><h2 className={styles.sectionTitle} id="spec-heading">{zh ? "产品规格" : "Specifications"}</h2><table className={styles.specTable}><caption className="sr-only">{product.name[locale]} — {zh ? "产品规格" : "Specifications"}</caption><tbody>{product.specifications.map(spec => <tr key={spec.id} data-spec-id={spec.id}><th scope="row">{spec.label[locale]}</th><td>{spec.value[locale]}</td></tr>)}</tbody></table></section>
    <section className={`${styles.certification} page-width`} aria-labelledby="test-report-heading">
      <svg viewBox="0 0 40 44" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M20 3 35 9v14c0 8-8 14-15 18C13 37 5 31 5 23V9L20 3Z" /><path d="M14 18h12m-12 7h12" strokeLinecap="round" /></svg>
      <div><h2 id="test-report-heading">{zh ? "拉力测试认证资料" : "Tensile test documentation"}</h2><p>{verified ? (zh ? "测试报告已提供" : "Test report supplied") : (zh ? "报告待核验" : "Test report awaiting verification")}</p>{verified && <a className="text-link" href={product.certification.reportUrl!}>{zh ? "查看测试报告" : "View test report"}</a>}</div>
    </section>
    <section className={styles.customSection} id="custom-colours" aria-labelledby="custom-colours-heading"><div className={`${styles.customInner} page-width`}><h2 className={styles.sectionTitle} id="custom-colours-heading">{zh ? "定制配色" : "Custom colours"}</h2><div className={styles.copy}><p>{zh ? "配色含 Pink Mint Haze，支持小批量定制配色。" : "Pink Mint Haze is available, with small-batch custom colours supported."}</p><Link href={`${localePath(locale, "contact")}?topic=custom-colours`} className="text-link mt-5">{zh ? "联系 W Pet" : "Contact W Pet"}<ArrowIcon className="h-4 w-4" /></Link></div></div></section>
  </div>;
}
