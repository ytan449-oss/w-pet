"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { useCartState } from "@/components/use-cart";
import { cartLines, cartTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { variantLabel } from "@/lib/product";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";
import styles from "@/components/shop.module.css";

export function CartPageContent({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const { items, update, storageError } = useCartState();
  const lines = cartLines(items ?? []);
  return <div className={styles.page}>
    <section className={`${styles.hero} page-width`} aria-labelledby="cart-title"><p className={styles.kicker}>W Pet · {zh ? "测试购物车" : "Test cart"}</p><h1 className={styles.title} id="cart-title">{zh ? "你的购物车" : "Your cart"}</h1><p className={styles.intro}>{zh ? "仅供支付测试，金额为测试占位金额，不是正式售价。" : "Sandbox checkout only. Amounts are test placeholders, not retail prices."}</p></section>
    <section className={`${styles.cartLayout} page-width`} aria-label={zh ? "购物车商品" : "Cart items"}>
      {items === null ? <p role="status">{zh ? "正在读取购物车…" : "Loading your cart…"}</p> : lines.length === 0 ? <div className={styles.emptyState}><h2 className={styles.sectionTitle}>{zh ? "购物车为空" : "Your cart is empty"}</h2><Link className="button-primary mt-6" href={localePath(locale, "collections/aotearoa-bloom")}>{zh ? "查看系列" : "Explore the collection"}<ArrowIcon className="h-5 w-5" /></Link></div> : <>
        <div>{lines.map(line => <article key={line.variantId} className={styles.cartLine}>
          <Link href={`${localePath(locale, `products/${line.product.slug}`)}?version=${line.variant.version}&length=${line.variant.lengthCm}`} className={styles.cartImage}><Image src={line.product.image} alt={line.product.imageAlt[locale]} width={120} height={120} /></Link>
          <div className={styles.cartLineBody}><h2><Link href={localePath(locale, `products/${line.product.slug}`)}>{line.product.name[locale]}</Link></h2><p>{variantLabel(line.product, line.variant, locale)}</p><p>{zh ? "测试单价" : "Test unit amount"}: {formatPrice(line.unitAmountMinor, locale)}</p>
            <div className={styles.cartControls}><label>{zh ? "数量" : "Quantity"}<input type="number" inputMode="numeric" min={1} max={10} step={1} value={line.quantity} onChange={event => update(items.map(item => item.variantId === line.variantId ? {...item,quantity:event.target.valueAsNumber} : item))} /></label><button className="text-link" type="button" onClick={() => update(items.filter(item => item.variantId !== line.variantId))} aria-label={`${zh ? "移除" : "Remove"} ${variantLabel(line.product, line.variant, locale)}`}>{zh ? "移除" : "Remove"}</button></div>
          </div><p className={styles.lineAmount}>{formatPrice(line.unitAmountMinor * line.quantity, locale)}</p>
        </article>)}</div>
        <aside className={styles.orderSummary} aria-labelledby="cart-summary-title"><h2 id="cart-summary-title">{zh ? "测试金额汇总" : "Test summary"}</h2><div className={styles.summaryRow}><span>{zh ? "商品合计" : "Items total"}</span><strong>{formatPrice(cartTotal(items), locale)}</strong></div><p className={styles.testNotice}>{zh ? "测试流程不创建发货订单。" : "This sandbox flow does not create a shipment order."}</p><Link className="button-primary mt-6 w-full" href={localePath(locale, "checkout")}>{zh ? "前往测试结账" : "Continue to test checkout"}<ArrowIcon className="h-5 w-5" /></Link><Link className="text-link mt-4" href={localePath(locale, "collections/aotearoa-bloom")}>{zh ? "继续浏览" : "Continue browsing"}</Link></aside>
      </>}
      {storageError && <p className={styles.cartError} role="alert">{zh ? "无法更新购物车。每个规格最多 10 件，总计最多 20 件；请检查浏览器存储设置。" : "Could not update the cart. Maximum 10 per variant and 20 total; check browser storage settings."}</p>}
    </section>
  </div>;
}
