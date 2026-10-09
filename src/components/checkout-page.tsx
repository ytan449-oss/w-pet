"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartState } from "@/components/use-cart";
import { cartLines, cartTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { variantLabel } from "@/lib/product";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";
import type { PaymentAvailability, PaymentProvider } from "@/types/checkout";
import styles from "@/components/shop.module.css";

export function CheckoutPageContent({ locale }: { locale: Locale }) {
  const zh=locale==="zh";
  const {items}=useCartState();
  const [availability,setAvailability]=useState<PaymentAvailability | null>(null);
  const [busy,setBusy]=useState<PaymentProvider | null>(null);
  const [error,setError]=useState("");
  const [cancelled,setCancelled]=useState(false);
  useEffect(()=>{
    setCancelled(new URLSearchParams(window.location.search).get("cancelled")==="1");
    const controller=new AbortController();
    fetch("/api/checkout/config",{signal:controller.signal,cache:"no-store"}).then(async response=>{
      if(!response.ok) throw new Error();
      setAvailability(await response.json());
    }).catch(()=>{if(!controller.signal.aborted) setAvailability({mode:"test",stripe:false,paypal:false});});
    return ()=>controller.abort();
  },[]);
  const lines=cartLines(items ?? []);
  async function start(provider: PaymentProvider) {
    if(!items?.length || busy) return;
    setBusy(provider);setError("");
    try {
      const response=await fetch(`/api/checkout/${provider}/create`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({items,locale})});
      const data=await response.json();
      if(!response.ok || typeof data.url!=="string") throw new Error(data.error ?? "payment_provider_unavailable");
      const url=new URL(data.url);
      const hosts=provider==="stripe" ? ["checkout.stripe.com"] : ["www.sandbox.paypal.com","sandbox.paypal.com"];
      if(url.protocol!=="https:" || !hosts.includes(url.hostname)) throw new Error("payment_provider_unavailable");
      window.location.assign(url.href);
    } catch(e) {
      setError(e instanceof Error && e.message==="payments_not_configured" ? (zh ? "测试支付暂未就绪。" : "Test payments are not available yet.") : (zh ? "无法开始测试支付，请重试。" : "Could not start test payment. Please try again."));
      setBusy(null);
    }
  }
  return <div className={styles.page}>
    <section className={`${styles.hero} page-width`} aria-labelledby="checkout-title"><p className={styles.kicker}>W Pet · {zh ? "测试模式" : "Test mode"}</p><h1 className={styles.title} id="checkout-title">{zh ? "测试结账" : "Test checkout"}</h1><p className={styles.intro}>{zh ? "仅使用测试支付。商品测试金额为 NZD 1.00/件，非正式售价，不创建发货订单。" : "Sandbox payments only. NZD 1.00 per item is a test amount, not the retail price. No shipment order is created."}</p></section>
    <section className={`${styles.cartLayout} page-width`} aria-label={zh ? "结账内容" : "Checkout details"}>
      {items===null ? <p role="status">{zh ? "正在读取购物车…" : "Loading your cart…"}</p> : !lines.length ? <div className={styles.emptyState}><h2 className={styles.sectionTitle}>{zh ? "购物车为空" : "Your cart is empty"}</h2><Link href={localePath(locale,"collections/aotearoa-bloom")} className="button-primary mt-6">{zh ? "查看系列" : "Explore the collection"}</Link></div> : <>
        <div>
          <h2 className={styles.sectionTitle}>{zh ? "支付方式" : "Payment method"}</h2>
          <div className={styles.paymentMethods}>
            <button className={styles.paymentButton} type="button" disabled={!availability?.stripe || !!busy} aria-busy={busy==="stripe"} onClick={()=>start("stripe")}><strong>Stripe Checkout</strong><span>{busy==="stripe" ? (zh ? "正在跳转…" : "Redirecting…") : (zh ? "卡支付 · 测试模式" : "Card payment · Test mode")}</span></button>
            <button className={styles.paymentButton} type="button" disabled={!availability?.paypal || !!busy} aria-busy={busy==="paypal"} onClick={()=>start("paypal")}><strong>PayPal</strong><span>{busy==="paypal" ? (zh ? "正在跳转…" : "Redirecting…") : "Sandbox"}</span></button>
          </div>
          {availability===null && <p className={styles.testNotice} role="status">{zh ? "正在检查支付可用性…" : "Checking payment availability…"}</p>}
          {availability && (!availability.stripe || !availability.paypal) && <p className={styles.paymentNote}>{zh ? "部分测试支付方式正在配置中，暂不可用。" : "Some test payment methods are being configured and are not available yet."}</p>}
          {cancelled && <p className={styles.paymentNote} role="status">{zh ? "支付已取消，购物车已保留。" : "Payment was cancelled. Your cart is saved."}</p>}
          {error && <p className={styles.cartError} role="alert">{error}</p>}
          <Link href={localePath(locale,"cart")} className="text-link mt-6">{zh ? "返回购物车" : "Back to cart"}</Link>
        </div>
        <aside className={styles.orderSummary} aria-labelledby="checkout-summary-title"><h2 id="checkout-summary-title">{zh ? "测试金额汇总" : "Test summary"}</h2>{lines.map(line=><div className={styles.checkoutLine} key={line.variantId}><p>{line.product.name[locale]}</p><small>{variantLabel(line.product,line.variant,locale)} × {line.quantity}</small><p>{formatPrice(line.unitAmountMinor*line.quantity,locale)}</p></div>)}<div className={styles.summaryRow}><span>{zh ? "测试合计" : "Test total"}</span><strong>{formatPrice(cartTotal(items),locale)}</strong></div></aside>
      </>}
    </section>
  </div>;
}
