import Link from "next/link";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";
import type { Policy } from "@/types/policy";
import styles from "@/components/support.module.css";

export function PolicyPage({ locale, policy }: { locale: Locale; policy: Policy }) {
  const zh = locale === "zh";
  const date = new Intl.DateTimeFormat(zh ? "zh-CN" : "en-NZ", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${policy.updated}T00:00:00Z`));
  return <div className={styles.page} data-policy-status="preview-draft">
    <section className={`${styles.hero} page-width`} aria-labelledby="policy-title">
      <p className={styles.kicker}>W Pet · {zh ? "测试站版本" : "Preview edition"}</p>
      <h1 id="policy-title" className={styles.title}>{policy.title[locale]}</h1>
      <p className={styles.intro}>{policy.intro[locale]}</p>
      <p className={styles.policyUpdated}>{zh ? "更新日期：" : "Updated: "}<time dateTime={policy.updated}>{date}</time></p>
      <p className={styles.policyNotice}>{policy.notice[locale]}</p>
    </section>
    <div className={`${styles.policyLayout} page-width`}>
      <nav className={styles.policyNavigation} aria-label={zh ? "本页导航" : "On this page"}>
        <h2>{zh ? "本页导航" : "On this page"}</h2>
        {policy.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.heading[locale]}</a>)}
      </nav>
      <article className={styles.policyArticle} aria-label={policy.title[locale]}>
        {policy.sections.map(section => <section className={styles.policySection} id={section.id} key={section.id} aria-labelledby={`heading-${section.id}`}>
          <h2 id={`heading-${section.id}`}>{section.heading[locale]}</h2>
          {section.paragraphs[locale].map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {section.links && <ul className={styles.policyLinks}>{section.links.map(link => <li key={link.href}><a href={link.href}>{link.label[locale]}</a></li>)}</ul>}
          {section.contactTopic && <Link className="text-link mt-4" href={`${localePath(locale, "contact")}?topic=${section.contactTopic}`}>{zh ? "联系 W Pet" : "Contact W Pet"}</Link>}
        </section>)}
        <nav className={styles.policyClosing} aria-label={zh ? "相关页面" : "Related pages"}>
          <Link className="text-link" href={localePath(locale, policy.slug === "privacy" ? "terms" : "privacy")}>{policy.slug === "privacy" ? (zh ? "条款与条件" : "Terms & conditions") : (zh ? "隐私政策" : "Privacy policy")}</Link>
          <Link className="text-link" href={localePath(locale, "collections/aotearoa-bloom")}>{zh ? "返回系列" : "Back to the collection"}</Link>
        </nav>
      </article>
    </div>
  </div>;
}
