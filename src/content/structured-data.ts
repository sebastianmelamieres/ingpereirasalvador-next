import { siteContent } from "./index";

/**
 * Datos estructurados (schema.org, JSON-LD) del sitio: migrados de `datosEstructurados()` en build.js.
 * Se arman a partir de site.json; la única diferencia con el original son las rutas de los assets.
 */
export function professionalServiceJsonLd() {
  const { site, contact, services } = siteContent;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: `${site.url}/`,
    image: `${site.url}${site.ogImage.src}`,
    logo: `${site.url}${site.logo.default}`,
    telephone: contact.phone.number,
    email: contact.email,
    // Sin zona cargada, el país (igual que el original)
    areaServed: contact.area || { "@type": "Country", name: site.country },
    founder: { "@type": "Person", name: site.owner.name, jobTitle: site.owner.jobTitle },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: services.title,
      itemListElement: services.items.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.title, description: service.description },
      })),
    },
  };
}

/** Serializa para un <script type="application/ld+json">: "<" escapado para que ningún texto pueda cerrar el <script>. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
