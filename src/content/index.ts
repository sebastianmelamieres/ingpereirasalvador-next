/**
 * Contenido del sitio.
 *
 * - `site.json` es la fuente de contenido: los textos se editan ahí.
 * - Este archivo define la forma del contenido y lo exporta tipado.
 *   Si site.json no respeta estos tipos, TypeScript falla (en `npm run lint`/`build`).
 *
 * Convenciones de site.json:
 * - Imágenes: rutas absolutas desde `public/`, por ejemplo "/images/services/termico.webp".
 * - Enlaces internos: anclas "#id", donde id es el `id` de una sección.
 * - WhatsApp, teléfono y email se guardan como datos (número, dirección);
 *   los enlaces se arman con las funciones de `links.ts`.
 * - Un texto vacío ("") significa "no mostrar" (por ejemplo `contact.area`).
 */
import site from "./site.json";

/* ---------- Piezas reutilizables ---------- */

/** Enlace con texto visible. `href` es un ancla interna ("#servicios"). */
export interface LinkItem {
  label: string;
  href: string;
}

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

/** Encabezado común de cada sección. `id` es el ancla de la sección. */
export interface SectionHeading {
  id: string;
  eyebrow: string;
  title: string;
}

/* ---------- Datos generales ---------- */

export interface SiteInfo {
  name: string;
  /** URL canónica, sin barra final. */
  url: string;
  title: string;
  description: string;
  /** Descripción corta para compartir en redes (Open Graph). */
  shareDescription: string;
  /** Locale para Open Graph, por ejemplo "es_UY". */
  locale: string;
  /** País de trabajo; se usa como zona de servicio cuando `contact.area` está vacío. */
  country: string;
  logo: {
    /** Logo para fondos claros. */
    default: string;
    /** Logo para fondos oscuros. */
    inverted: string;
  };
  ogImage: ImageAsset;
  /** Profesional responsable (datos estructurados). */
  owner: {
    name: string;
    jobTitle: string;
  };
}

export interface ContactInfo {
  phone: {
    /** Cómo se muestra el teléfono. */
    display: string;
    /** Número en formato internacional para `tel:`. */
    number: string;
  };
  email: string;
  whatsapp: {
    /** Número sin "+" ni espacios, como lo espera wa.me. */
    number: string;
    /** Mensaje precargado al abrir el chat. */
    message: string;
  };
  /** Zona de trabajo. Vacío = no se muestra. */
  area: string;
}

/* ---------- Navegación ---------- */

export interface Navigation {
  homeHref: string;
  homeLabel: string;
  logoAlt: string;
  openMenuLabel: string;
  closeMenuLabel: string;
  whatsappLabel: string;
  items: LinkItem[];
}

/* ---------- Secciones ---------- */

export interface Hero extends SectionHeading {
  text: string;
  whatsappCta: string;
  secondaryCta: LinkItem;
}

export interface Service {
  title: string;
  description: string;
  /** Foto de fondo de la tarjeta. Sin imagen se muestra la tarjeta sin foto. */
  image?: string;
  /** Encuadre de la foto (valor de `object-position`), por ejemplo "80% center". */
  imagePosition?: string;
}

export interface ServicesSection extends SectionHeading {
  items: Service[];
  closingCard: {
    title: string;
    description: string;
    href: string;
  };
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ProcessSection extends SectionHeading {
  steps: ProcessStep[];
  whatsappCta: string;
}

export interface Fact {
  value: string;
  label: string;
}

export interface AboutSection extends SectionHeading {
  image?: string;
  paragraphs: string[];
  facts: Fact[];
}

export interface Project {
  title: string;
  /** Tipo de servicio y lugar, por ejemplo "Proyecto y trámite · Montevideo". */
  detail: string;
  image?: string;
}

/** Con `items` vacío la sección (y su enlace en el menú) no se muestra. */
export interface ProjectsSection extends SectionHeading {
  items: Project[];
}

export interface ContactSection extends SectionHeading {
  text: string;
  whatsappCta: string;
  labels: {
    phone: string;
    email: string;
    area: string;
  };
}

export interface FormField {
  label: string;
  placeholder?: string;
}

export interface ContactForm {
  title: string;
  fields: {
    name: FormField;
    email: FormField;
    phone: FormField;
    /** Las opciones son los títulos de los servicios + `otherOption`. */
    service: FormField & { otherOption: string };
    message: FormField;
  };
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
  /** Rótulo del campo trampa para bots (invisible para personas). */
  honeypotLabel: string;
}

export interface WhatsAppButton {
  text: string;
  ariaLabel: string;
}

export interface Footer {
  navigationTitle: string;
  navigationAriaLabel: string;
  contactTitle: string;
  /** Texto después de "© <año>". */
  text: string;
}

/* ---------- Contenido completo ---------- */

export interface SiteContent {
  site: SiteInfo;
  contact: ContactInfo;
  navigation: Navigation;
  hero: Hero;
  services: ServicesSection;
  process: ProcessSection;
  about: AboutSection;
  projects: ProjectsSection;
  contactSection: ContactSection;
  contactForm: ContactForm;
  whatsappButton: WhatsAppButton;
  footer: Footer;
}

export const siteContent: SiteContent = site;

/* ---------- Datos derivados ---------- */

/** La sección Trabajos solo se muestra si hay proyectos (igual que en el sitio original). */
export const showProjects = siteContent.projects.items.length > 0;

const hiddenSectionIds = showProjects ? [] : [siteContent.projects.id];

/** Ítems de navegación sin los que apuntan a secciones ocultas (menú y pie). */
export const navigationItems: LinkItem[] = siteContent.navigation.items.filter(
  (item) => !hiddenSectionIds.includes(item.href.slice(1)),
);
