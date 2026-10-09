"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cartLines, loadCart, saveCart } from "@/lib/cart";
import { formatPrice } from "@/lib/catalog";
import { removePurchasedItems, verifiedReceipt } from "@/lib/payment-receipt";
import { variantLabel } from "@/lib/product";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";
import type { PaymentProvider, PaymentReceipt } from "@/types/checkout";
import styles from "@/components/shop.module.css";

type Result = { state: "checking" | "missing" | "error" } | { state: "verified"; receipt: PaymentReceipt; cartRetained: boolean };

function settleCart(receipt: PaymentReceipt) {
  if (receipt.status !== "paid") return false;
  const key = `w-pet-paid-cart:${receipt.provider}:${receipt.reference}`;
  try {
    if (window.sessionStorage.getItem(key)) return false;
    const remaining = removePurchasedItems(loadCart(), receipt.items);
    window.sessionStorage.setItem(key, "1");
    try { saveCart(remaining); }
    catch { window.sessionStorage.removeItem(key); return true; }
    return false;
  } catch { return true; }
}

export function OrderSuccessPageContent({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [result, setResult] = useState<Result>({ state: "checking" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const reference = params.get(provider === "stripe" ? "session_id" : "token");
    if ((provider !== "stripe" && provider !== "paypal") || !reference || reference.length > 100) {
      setResult({ state: "missing" }); return;
    }
    const controller = new AbortController();
    setResult({ state: "checking" });
    fetch(`/api/checkout/${provider}/confirm`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference }), signal: controller.signal, cache: "no-store",
    }).then(async response => {
      if (!response.ok) throw new Error("confirmation_failed");
      const receipt = verifiedReceipt(await response.json(), provider as PaymentProvider, reference);
      if (!controller.signal.aborted) setResult({ state: "verified", receipt, cartRetained: settleCart(receipt) });
    }).catch(() => { if (!controller.signal.aborted) setResult({ state: "error" }); });
    return () => controller.abort();
  }, [attempt]);

  const receipt = result.state === "verified" ? result.receipt : null;
  const paid = receipt?.status === "paid";
  const title = paid ? (zh ? "测试支付已确认" : "Test payment confirmed")
    : receipt?.status === "expired" ? (zh ? "测试支付已过期" : "Test checkout expired")
    : receipt?.status === "pending" ? (zh ? "测试支付尚未完成" : "Test payment pending")
    : result.state === "checking" ? (zh ? "正在核验测试支付" : "Verifying your test payment")
    : (zh ? "测试支付未确认" : "Test payment not confirmed");
  const description = paid ? (zh ? "支付平台已确认本次测试交易。这不是正式订单，不安排发货。" : "The payment provider confirmed this sandbox transaction. This is not a retail order and no shipment is arranged.")
    : result.state === "missing" ? (zh ? "此页面未收到支付平台的回跳信息，无法确认支付。" : "No payment return reference was received. Payment cannot be confirmed.")
    : result.state === "error" ? (zh ? "暂时无法核验本次测试支付。购物车已保留，可重试或返回结账。" : "We could not verify this test payment. Your cart is saved. Retry verification or return to checkout.")
    : receipt?.status === "expired" ? (zh ? "此次测试会话已过期。购物车已保留，可重新结账。" : "This test session has expired. Your cart is saved; you can start checkout again.")
    : receipt?.status === "pending" ? (zh ? "支付平台尚未确认完成。购物车已保留，请稍后重试核验。" : "The payment provider has not confirmed completion. Your cart is saved; try verification again shortly.")
    : (zh ? "正在向支付平台核对交易状态与金额…" : "Checking the transaction status and amount with your payment provider…");

  return <div className={styles.page}>
    <section className={`${styles.hero} page-width`} aria-labelledby="payment-result-title">
      <p className={styles.kicker}>W Pet · {zh ? "测试模式" : "Test mode"}</p>
      <div className={styles.resultStatus} role="status" aria-live="polite">
        {paid && <svg className={styles.resultIcon} viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.5"/><path d="m14 24 7 7 14-15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        <h1 id="payment-result-title" className={styles.title}>{title}</h1>
        <p className={styles.intro}>{description}</p>
      </div>
      {result.state === "verified" && result.cartRetained && <p className={styles.paymentNote}>{zh ? "浏览器未能更新购物车，可在购物车中手动移除已支付商品。" : "Your browser could not update the cart. You can remove the paid items in your cart."}</p>}
      <div className={styles.resultActions}>
        {(result.state === "error" || receipt?.status === "pending") && <button className="button-primary" type="button" onClick={() => setAttempt(value => value + 1)}>{zh ? "重试核验" : "Retry verification"}</button>}
        <Link className={paid ? "button-primary" : "text-link"} href={localePath(locale, paid ? "collections/aotearoa-bloom" : "checkout")}>{paid ? (zh ? "继续探索系列" : "Explore the collection") : (zh ? "返回结账" : "Back to checkout")}</Link>
        <Link className="text-link" href={localePath(locale, "cart")}>{zh ? "查看购物车" : "View cart"}</Link>
      </div>
    </section>
    {paid && receipt && <section className={`${styles.receiptSection} page-width`} aria-labelledby="test-receipt-title">
      <h2 id="test-receipt-title" className={styles.sectionTitle}>{zh ? "测试交易记录" : "Sandbox receipt"}</h2>
      <dl className={styles.receiptDetails}>
        <div><dt>{zh ? "支付方式" : "Payment method"}</dt><dd>{receipt.provider === "stripe" ? "Stripe Checkout" : "PayPal Sandbox"}</dd></div>
        <div><dt>{zh ? "交易编号" : "Transaction reference"}</dt><dd>{receipt.reference}</dd></div>
        <div><dt>{zh ? "测试合计" : "Test total"}</dt><dd>{formatPrice(receipt.amountMinor, locale)}</dd></div>
      </dl>
      {cartLines(receipt.items).map(line => <div className={styles.checkoutLine} key={line.variantId}><p>{line.product.name[locale]}</p><small>{variantLabel(line.product, line.variant, locale)} × {line.quantity}</small><p>{formatPrice(line.quantity * line.unitAmountMinor, locale)}</p></div>)}
      <p className={styles.testNotice}>{zh ? "NZD 1.00/件仅为测试金额，非正式售价。" : "NZD 1.00 per item is a test amount, not the retail price."}</p>
    </section>}
  </div>;
}
