"""Audit actual Next exports. Does not claim browser layout or provider E2E verification."""
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"

class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.file = file
        self.title = ""
        self.in_title = False
        self.meta = {}
        self.links = []
        self.assets = []
        self.ids = set()
        self.h1 = 0
        self.lang = None
        self.form = False
        self.feed(file.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "html": self.lang = attrs.get("lang")
        if tag == "title": self.in_title = True
        if tag == "h1": self.h1 += 1
        if tag == "meta": self.meta[attrs.get("name") or attrs.get("property")] = attrs.get("content", "")
        if tag in ("a", "link") and attrs.get("href"):
            self.links.append((tag, attrs))
        if tag in ("img", "script", "source", "image"):
            if tag == "img": assert "alt" in attrs, f"Missing alt: {self.file}"
            for key in ("src", "href", "xlink:href"):
                if attrs.get(key): self.assets.append(attrs[key])
            for entry in attrs.get("srcset", "").split(","):
                if entry.strip(): self.assets.append(entry.strip().split()[0])
        if tag == "form": self.form = True

    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False

    def handle_data(self, data):
        if self.in_title: self.title += data

pages = {}
for file in sorted(OUT.rglob("index.html")):
    route = "/" + str(file.parent.relative_to(OUT)).replace("\\", "/").strip(".")
    if not route.endswith("/"): route += "/"
    pages[route] = Page(file)
for name in ("404.html", "404/index.html"):
    if (OUT / name).is_file(): pages["/" + name] = Page(OUT / name)

link_count = image_count = 0
unique = defaultdict(lambda: {"titles": set(), "descriptions": set(), "count": 0})
origins = set()
for route, page in pages.items():
    assert page.title.strip() and page.h1 == 1, f"Title/H1: {route}"
    assert "width=device-width" in page.meta.get("viewport", ""), f"Viewport: {route}"
    if route.startswith(("/en/", "/zh/")):
        locale = route.split("/")[1]
        expected_lang = "en-NZ" if locale == "en" else "zh-CN"
        assert page.lang == expected_lang, f"HTML lang: {route}"
        desc = page.meta.get("description", "")
        assert len(desc) > 20, f"Description: {route}"
        assert page.meta.get("og:description") == desc, f"OG description: {route}"
        assert "noindex" in page.meta.get("robots", ""), f"Preview indexing: {route}"
        stats = unique[locale]
        assert page.title not in stats["titles"], f"Duplicate title: {route}"
        assert desc not in stats["descriptions"], f"Duplicate description: {route}"
        stats["titles"].add(page.title); stats["descriptions"].add(desc); stats["count"] += 1
        canonical = [attrs["href"] for tag, attrs in page.links if tag == "link" and attrs.get("rel") == "canonical"]
        assert len(canonical) == 1 and urlsplit(canonical[0]).path == route, f"Canonical: {route}"
        origins.add(urlsplit(canonical[0]).netloc)
        alternate = {attrs.get("hreflang"): attrs["href"] for tag, attrs in page.links if tag == "link" and attrs.get("rel") == "alternate"}
        rest = "/".join(route.split("/")[2:])
        assert urlsplit(alternate["en-NZ"]).path == "/en/" + rest
        assert urlsplit(alternate["zh-CN"]).path == "/zh/" + rest
        assert alternate["x-default"] == alternate["en-NZ"]
        target_locale = "zh" if locale == "en" else "en"
        assert any(attrs.get("hreflang") == ("zh-CN" if locale == "en" else "en-NZ") and attrs["href"] == f"/{target_locale}/{rest}" for tag, attrs in page.links if tag == "a"), f"Language switch: {route}"
    for asset in page.assets:
        parsed = urlsplit(asset)
        assert not parsed.scheme and not parsed.netloc and parsed.path.startswith("/"), f"External asset: {route}: {asset}"
        assert (OUT / unquote(parsed.path).lstrip("/")).is_file(), f"Missing asset: {asset}"
        image_count += 1
    for tag, attrs in page.links:
        parsed = urlsplit(attrs["href"])
        if parsed.scheme or parsed.netloc: continue
        target = parsed.path or route
        if target.startswith("/_next/"):
            assert (OUT / target.lstrip("/")).is_file(), f"Missing stylesheet: {target}"
        else:
            assert target in pages or (OUT / target.lstrip("/")).is_file(), f"Broken link: {route}: {target}"
            if parsed.fragment: assert unquote(parsed.fragment) in pages[target].ids, f"Missing anchor: {route}: {attrs['href']}"
        link_count += 1

assert len(origins) == 1
for css in OUT.rglob("*.css"):
    for asset in re.findall(r"url\([\"']?([^\)\"']+)", css.read_text()):
        assert not asset.startswith(("http:", "https:", "//")), f"External CSS asset: {css}"
for svg in (OUT / "images").glob("*.svg"):
    for node in ET.parse(svg).iter():
        for key, value in node.attrib.items():
            if key.endswith("href"): assert not value.startswith(("http:", "https:", "//")), f"External SVG image: {svg}"

sitemap = ET.parse(OUT / "sitemap.xml")
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
entries = sitemap.findall("s:url", ns)
expected = {route for route in pages if route.startswith(("/en/", "/zh/")) and route.split("/")[2] not in {"cart", "checkout", "order-success"}}
actual = set()
for entry in entries:
    loc = entry.findtext("s:loc", namespaces=ns)
    parsed = urlsplit(loc)
    assert parsed.netloc in origins and parsed.path in expected
    assert len(entry.findall("x:link", ns)) == 3
    actual.add(parsed.path)
assert actual == expected and len(entries) == len(expected)
assert "sitemap.xml" in (OUT / "robots.txt").read_text()
assert all(pages[f"/{locale}/contact/"].form for locale in ("en", "zh"))
print(json.dumps({"html_routes": len(pages), "localized_pages": {locale: stats["count"] for locale, stats in unique.items()}, "internal_links_and_stylesheets": link_count, "local_asset_references": image_count, "sitemap_urls": len(entries), "external_assets": 0, "browser_layout": "not run", "provider_sandbox_e2e": "credentials required"}, ensure_ascii=False))
