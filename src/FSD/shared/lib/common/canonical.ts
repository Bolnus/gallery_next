const DEFAULT_SITE_URL = "https://recipes-rho-ten.vercel.app";

export function getSiteUrl(): string {
  const url = process.env.SITE_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, "") : DEFAULT_SITE_URL;
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteUrl()}/`);
}

/**
 * Builds an absolute canonical URL for a locale-prefixed route.
 * @param locale - Locale segment (e.g. "ru", "en")
 * @param path - Path after locale, with or without leading slash. Use "" or "/" for locale root.
 */
export function canonicalPath(locale: string, path: string = ""): string {
  const siteUrl = getSiteUrl();
  const normalizedPath = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}/${locale}${normalizedPath}`;
}
