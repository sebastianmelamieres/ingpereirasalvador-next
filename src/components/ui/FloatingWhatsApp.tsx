import { siteContent } from "@/content";
import { whatsappHref } from "@/content/links";
import styles from "./FloatingWhatsApp.module.css";

/** Botón flotante de WhatsApp, fijo abajo a la derecha. El texto aparece con hover o foco (oculto hasta 520px). */
export function FloatingWhatsApp() {
  const { whatsappButton, contact } = siteContent;

  return (
    <a
      href={whatsappHref(contact)}
      target="_blank"
      rel="noopener"
      aria-label={whatsappButton.ariaLabel}
      className={`${styles.float} fixed right-5 bottom-5 z-60 flex items-center gap-3 no-underline max-sm:right-4 max-sm:bottom-4`}
    >
      <span
        className={`${styles.text} rounded-full bg-white px-4 py-[0.55rem] text-[0.95rem] font-bold whitespace-nowrap text-ink max-sm:hidden`}
      >
        {whatsappButton.text}
      </span>
      <span
        className={`${styles.icon} grid size-15 place-items-center rounded-[50%] bg-whatsapp text-white max-sm:size-14`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          <path
            d="M15.6 13.9v1.1a.75.75 0 0 1-.8.75 7.4 7.4 0 0 1-3.2-1.15 7.3 7.3 0 0 1-2.25-2.25A7.4 7.4 0 0 1 8.2 9.1a.75.75 0 0 1 .75-.8h1.1a.75.75 0 0 1 .75.64c.05.36.13.71.26 1.05a.75.75 0 0 1-.17.79l-.47.47a6 6 0 0 0 2.25 2.25l.47-.47a.75.75 0 0 1 .79-.17c.34.13.69.21 1.05.26a.75.75 0 0 1 .64.76z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      </span>
    </a>
  );
}
