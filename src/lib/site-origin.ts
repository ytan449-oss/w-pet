const DEFAULT_ORIGIN = "https://w-pet-aotearoa-bloom.redcrumb3.chatgpt.site";

/** Build-time metadata origin; never derive an absolute URL from a visitor's Host header. */
export function siteOrigin(env: Record<string, string | undefined> = process.env): string {
  const value = env.WPET_PUBLIC_SITE_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : DEFAULT_ORIGIN);
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/"
      || (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)))) {
    throw new Error("WPET_PUBLIC_SITE_URL must be a trusted HTTPS site origin.");
  }
  return url.origin;
}
