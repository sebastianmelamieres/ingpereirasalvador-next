import Image from "next/image";
import type { Service } from "@/content";
import styles from "./ServiceCard.module.css";
import { TapToggleArticle } from "./TapToggleArticle";

/** Base común de las tarjetas de la grilla de servicios (.service del original). */
export const serviceCardBase = `${styles.card} relative rounded-card p-7`;

const titleClasses = "text-[1.3rem] font-bold";

interface ServiceCardProps {
  service: Service;
  /** Orden de aparición al hacer scroll (ver ScrollReveal). */
  revealOrder?: number;
}

export function ServiceCard({ service, revealOrder }: ServiceCardProps) {
  // Sin foto: tarjeta blanca con título y descripción visibles
  if (!service.image) {
    return (
      <article className={`${serviceCardBase} bg-white`} data-reveal={revealOrder}>
        <h3 className={`${titleClasses} mb-[0.6rem]`}>{service.title}</h3>
        <p className="text-[1.0625rem] text-ink-muted">{service.description}</p>
      </article>
    );
  }

  // Con foto: la descripción aparece con hover, foco de teclado o un toque
  return (
    <TapToggleArticle
      className={`${serviceCardBase} ${styles.photo} bg-brand-dark text-white`}
      revealOrder={revealOrder}
    >
      {/* Foto decorativa (alt vacío): el contenido es el título y la descripción */}
      <Image
        className={styles.image}
        src={service.image}
        alt=""
        width={800}
        height={800}
        style={service.imagePosition ? { objectPosition: service.imagePosition } : undefined}
      />
      <h3 className={titleClasses}>{service.title}</h3>
      <div className={styles.desc}>
        <p className="text-[1.0625rem] text-white/92">{service.description}</p>
      </div>
    </TapToggleArticle>
  );
}
