"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { brand } from "@/config/brand";
import { contactTopics, isContactTopic, type ContactTopic } from "@/config/contact";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";
import styles from "@/components/support.module.css";

export function ContactPage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const [topic, setTopic] = useState<ContactTopic>("general");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [check, setCheck] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const requestId = useRef<string | null>(null);
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("topic");
    if (isContactTopic(initial)) setTopic(initial);
  }, []);
  useEffect(() => {
    const controller = new AbortController(); setAvailable(null);
    fetch("/api/contact/config", { signal: controller.signal, cache: "no-store" }).then(async response => {
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!controller.signal.aborted) setAvailable(data.available === true);
    }).catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    return () => controller.abort();
  }, [check]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy || !available) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      requestId.current ??= crypto.randomUUID();
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
        name: data.get("name"), email: data.get("email"), topic, message: data.get("message"),
        consent: data.get("consent") === "yes", website: data.get("website"), locale, clientRequestId: requestId.current,
      }) });
      const result = await response.json();
      if (!response.ok || result.saved !== true || typeof result.reference !== "string") throw new Error(result.error ?? "contact_unavailable");
      setReference(result.reference);
    } catch (problem) {
      const code = problem instanceof Error ? problem.message : "contact_unavailable";
      setError(code === "rate_limited" ? (zh ? "咨询提交较频繁，请稍后再试。" : "There have been several enquiries recently. Please try again later.")
        : code === "invalid_fields" ? (zh ? "请检查姓名、邮箱、咨询内容（20–2000 个字符），并勾选隐私说明。" : "Please check your name, email, message (20–2000 characters) and privacy acknowledgement.")
        : (zh ? "咨询尚未确认保存，请保留当前内容并重试。" : "Your enquiry has not been confirmed as saved. Keep your message and try again."));
    } finally { setBusy(false); }
  }
  function choose(next: ContactTopic) { setTopic(next); requestId.current = null; }

  return <div className={styles.page}>
    <section className={`${styles.hero} page-width`} aria-labelledby="contact-title">
      <p className={styles.kicker}>W Pet · Aotearoa</p>
      <h1 id="contact-title" className={styles.title}>{zh ? "联系我们" : "Say hello to W Pet"}</h1>
      <p className={styles.slogan} lang="en-NZ">{brand.sloganEn}</p>
      <p className={styles.slogan} lang="zh-CN">{brand.sloganZh}</p>
      <p className={styles.intro}>{zh ? "产品咨询、小批量定制配色，或想与 W Pet 分享的想法，都可以从这里开始。" : "Product questions, small-batch custom colours, or a note for W Pet. Start here."}</p>
    </section>
    <section className={`${styles.contactLayout} page-width`} aria-label={zh ? "咨询表单与指南" : "Enquiry form and guidance"}>
      {reference ? <div className={styles.confirmation} role="status" aria-live="polite">
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="m14 24 7 7 14-15" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <h2>{zh ? "咨询已保存" : "Your enquiry is saved"}</h2>
        <p>{zh ? "请保留以下咨询编号，以便后续联系。提交咨询不会创建订单。" : "Keep this reference for any follow-up. Submitting an enquiry does not create an order."}</p>
        <code className={styles.reference}>{reference}</code>
        <button className="button-secondary" type="button" onClick={() => { setReference(null); requestId.current = null; setError(""); }}>{zh ? "提交另一条咨询" : "Send another enquiry"}</button>
      </div> : <form id="contact-form" className={styles.form} onSubmit={submit} onChange={() => { requestId.current = null; setError(""); }} aria-busy={busy}>
        <div className={styles.formRow}>
          <label className={styles.field} htmlFor="contact-name">{zh ? "姓名" : "Name"}<input id="contact-name" name="name" autoComplete="name" required minLength={1} maxLength={80} disabled={busy}/></label>
          <label className={styles.field} htmlFor="contact-email">{zh ? "邮箱" : "Email"}<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} disabled={busy}/></label>
        </div>
        <label className={styles.field} htmlFor="contact-topic">{zh ? "咨询主题" : "Enquiry topic"}<select id="contact-topic" name="topic" value={topic} disabled={busy} onChange={event => { if (isContactTopic(event.target.value)) choose(event.target.value); }}>{contactTopics.map(item => <option key={item.id} value={item.id}>{item.label[locale]}</option>)}</select></label>
        <label className={styles.field} htmlFor="contact-message">{zh ? "咨询内容" : "Your message"}<textarea id="contact-message" name="message" required minLength={20} maxLength={2000} rows={7} disabled={busy} aria-describedby="contact-message-hint"/><small id="contact-message-hint">{zh ? "20–2000 个字符。请仅提供处理咨询所需的信息。" : "20–2000 characters. Share only the information needed for your enquiry."}</small></label>
        <div className={styles.trap} aria-hidden="true"><label htmlFor="contact-website">Website<input id="contact-website" name="website" autoComplete="off" tabIndex={-1}/></label></div>
        <label className={styles.consent}><input name="consent" type="checkbox" value="yes" required disabled={busy}/><span>{zh ? "我已阅读" : "I have read the "}<Link href={localePath(locale, "privacy")}>{zh ? "隐私政策" : "privacy policy"}</Link>{zh ? "，了解 W Pet 将保存上述信息用于处理本次咨询。" : " and understand W Pet will save these details to handle this enquiry."}</span></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.submitRow}><button className="button-primary" type="submit" disabled={busy || available !== true}>{busy ? (zh ? "正在保存…" : "Saving…") : (zh ? "提交咨询" : "Send enquiry")}</button>{available === null && <p className={styles.helper} role="status">{zh ? "正在准备表单…" : "Preparing the form…"}</p>}</div>
        {available === false && <div><p className={styles.helper} role="status">{zh ? "咨询表单暂不可用，请稍后重试。" : "The enquiry form is temporarily unavailable. Please try again shortly."}</p><button className="text-link" type="button" onClick={() => setCheck(value => value + 1)}>{zh ? "重新检查" : "Try again"}</button></div>}
      </form>}
      <aside className={styles.tips} aria-labelledby="contact-help-title">
        <h2 id="contact-help-title">{zh ? "从这里开始" : "A little guidance"}</h2>
        <div className={styles.tip}><h3>{zh ? "小批量定制配色" : "Small-batch custom colours"}</h3><p>{zh ? "请告诉我们想要的颜色、标准版或轻量版、1.2m 或 2m 长度，以及数量。价格和交付安排需另行确认。" : "Tell us your colours, standard or lightweight version, 1.2m or 2m length, and quantity. Pricing and delivery arrangements need separate confirmation."}</p>{!reference && <a className="text-link" href="#contact-form" onClick={() => choose("custom-colours")}>{zh ? "咨询定制配色" : "Ask about custom colours"}</a>}</div>
        <div className={styles.tip}><h3>{zh ? "产品与养护" : "Product & care"}</h3><p>{zh ? "查看产品规格与已提供的 FAQ。官方清洗与存放说明仍待确认，可通过本页咨询。" : "Explore the product specifications and available FAQs. Official washing and storage instructions are awaiting confirmation; ask us here."}</p><Link className="text-link" href={localePath(locale, "care-faq")}>{zh ? "查看养护与 FAQ" : "Visit Care & FAQ"}</Link></div>
        <div className={styles.tip}><h3>{zh ? "隐私请求" : "Privacy requests"}</h3><p>{zh ? "如需访问、更正或申请删除咨询信息，请选择“隐私请求”并提供咨询编号。" : "For access, correction or a deletion request, choose Privacy request and include your enquiry reference."}</p>{!reference && <a className="text-link" href="#contact-form" onClick={() => choose("privacy")}>{zh ? "提交隐私请求" : "Make a privacy request"}</a>}</div>
      </aside>
    </section>
  </div>;
}
