"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BagIcon } from "@/components/icons";
import { getDictionary } from "@/lib/i18n";
import { localePath, switchLocalePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";

export function SiteHeader({ locale }: { locale: Locale }) {
  const d = getDictionary(locale).site;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const alternate: Locale = locale === "en" ? "zh" : "en";
  const nav = [
    ["collections/aotearoa-bloom", d.collection],
    ["our-story", d.story],
    ["craftsmanship", d.craft],
    ["care-faq", d.care],
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="announcement">{d.announcement}<span aria-hidden="true"> ✳</span></div>
      <header className="site-header">
        <div className="page-width flex min-h-22 items-center justify-between gap-4">
          <Link href={localePath(locale)} className="wordmark" aria-label={locale === "en" ? "W Pet home" : "W Pet 首页"} onClick={() => setOpen(false)}>W <span>Pet</span><i aria-hidden="true">✳</i></Link>
          <nav className="hidden items-center gap-8 lg:flex" aria-label={locale === "en" ? "Main navigation" : "主导航"}>
            {nav.map(([path, label]) => <Link key={path} href={localePath(locale, path)} className="nav-link" aria-current={pathname === localePath(locale, path) ? "page" : undefined}>{label}</Link>)}
          </nav>
          <div className="flex items-center gap-1 sm:gap-4">
            <Link href={switchLocalePath(pathname, alternate)} hrefLang={alternate === "zh" ? "zh-CN" : "en-NZ"} lang={alternate === "zh" ? "zh-CN" : "en"} className="language-link" aria-label={d.switchLanguage} onClick={(event) => {
              if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              setOpen(false);
              router.push(switchLocalePath(pathname + window.location.search + window.location.hash, alternate));
            }}>{locale === "en" ? "中文" : "EN"}</Link>
            <span className="h-4 w-px bg-ink/15" aria-hidden="true" />
            <Link href={localePath(locale, "cart")} className="icon-button" aria-label={d.bag} onClick={() => setOpen(false)}><BagIcon className="h-5 w-5" /></Link>
            <button ref={toggleRef} className="icon-button lg:hidden" aria-label={open ? d.closeMenu : d.menu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-6 w-6">{open ? <path d="m5 5 14 14M5 19 19 5" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
            </button>
          </div>
        </div>
        <nav id="mobile-navigation" hidden={!open} className="mobile-navigation lg:hidden" aria-label={locale === "en" ? "Mobile navigation" : "移动导航"}>
          {nav.map(([path, label]) => <Link key={path} href={localePath(locale, path)} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href={localePath(locale, "contact")} onClick={() => setOpen(false)}>{d.contact}</Link>
        </nav>
      </header>
    </>
  );
}
