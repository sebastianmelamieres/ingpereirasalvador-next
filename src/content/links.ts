import type { ContactInfo } from "./index";

// Enlaces de contacto armados a partir de los datos de site.json
// (mismo formato que usaba el sitio original).

export function whatsappHref({ whatsapp }: ContactInfo): string {
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`;
}

export function phoneHref({ phone }: ContactInfo): string {
  return `tel:${phone.number}`;
}

export function emailHref({ email }: ContactInfo): string {
  return `mailto:${email}`;
}
