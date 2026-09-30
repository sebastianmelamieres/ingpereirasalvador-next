interface EyebrowProps {
  children: string;
  /** Color para fondos azules (.eyebrow--light). */
  light?: boolean;
  className?: string;
  /** Orden de aparición al hacer scroll (ver ScrollReveal). Sin valor, no aparece animado. */
  revealOrder?: number;
}

/** Etiqueta en mayúsculas sobre los títulos (.eyebrow del original). */
export function Eyebrow({ children, light = false, className = "", revealOrder }: EyebrowProps) {
  return (
    <p
      data-reveal={revealOrder}
      className={`mb-3 text-[0.85rem] font-bold uppercase tracking-[0.12em] ${
        light ? "text-white/80" : "text-brand"
      } ${className}`}
    >
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Colores para secciones con fondo azul (.eyebrow--light / .section__title--light). */
  light?: boolean;
  /**
   * Espaciado y ancho del bloque. El margen inferior varía según la sección en el original
   * (2.5rem en general, 1.5rem en Sobre mí, 1rem en Contacto), por eso lo define quien lo usa.
   */
  className?: string;
  /** Clases extra del título, por ejemplo el ancho máximo de .section__title--narrow. */
  titleClassName?: string;
}

/** Etiqueta + título de sección (.eyebrow + .section__title del original). */
export function SectionHeading({
  eyebrow,
  title,
  light = false,
  className = "",
  titleClassName = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {/* Etiqueta y título aparecen al hacer scroll (orden 0 y 1) */}
      <Eyebrow light={light} revealOrder={0}>
        {eyebrow}
      </Eyebrow>
      <h2
        data-reveal={1}
        className={`text-[clamp(2rem,4.5vw,3rem)] font-black ${light ? "text-white" : "text-brand"} ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
}
