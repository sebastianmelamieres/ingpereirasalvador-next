import { siteContent } from "@/content";

const { site } = siteContent;

/** Base de las URLs absolutas del sitio (site.url). La usa también `metadataBase` en layout.tsx. */
export const siteUrl = new URL(`${site.url}/`);

/** Resuelve una ruta del sitio ("/", "/images/og-image.jpg") contra siteUrl. */
const absolute = (path: string) => new URL(path, siteUrl).href;

/**
 * Canonical, Open Graph y Twitter: los mismos tags del sitio original (src/plantilla.html).
 *
 * Se escriben a mano en vez de usar `metadata.alternates` / `openGraph` / `twitter` porque
 * la Metadata API de Next no permite replicar el original exacto:
 * - la URL de la página principal sale sin barra final ("https://ingpereirasalvador.com"),
 *   salvo activando `trailingSlash` para todo el sitio;
 * - con `openGraph` definido, completa sola twitter:title, twitter:description y twitter:image*
 *   (el original solo tiene twitter:card).
 * Title y description sí salen de la Metadata API (layout.tsx).
 */
export function SocialMetaTags() {
  const pageUrl = absolute("/");

  return (
    <>
      <link rel="canonical" href={pageUrl} />
      <meta property="og:title" content={site.title} />
      <meta property="og:description" content={site.shareDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={absolute(site.ogImage.src)} />
      <meta property="og:image:width" content={String(site.ogImage.width)} />
      <meta property="og:image:height" content={String(site.ogImage.height)} />
      <meta property="og:image:alt" content={site.title} />
      <meta property="og:locale" content={site.locale} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
