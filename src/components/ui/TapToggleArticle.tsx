"use client";

import { useState, type ReactNode } from "react";

interface TapToggleArticleProps {
  className: string;
  /** Orden de aparición al hacer scroll (ver ScrollReveal). */
  revealOrder?: number;
  children: ReactNode;
}

/**
 * <article> enfocable que, en pantallas táctiles (sin hover), alterna su estado activo
 * con un toque (`data-active`). Es la lógica de js/main.js para las tarjetas con foto;
 * en dispositivos con mouse el click no hace nada y el efecto lo da el hover (CSS).
 * El contenido se renderiza en el servidor y llega como children.
 */
export function TapToggleArticle({ className, revealOrder, children }: TapToggleArticleProps) {
  const [active, setActive] = useState(false);

  function handleClick() {
    if (window.matchMedia("(hover: none)").matches) setActive((value) => !value);
  }

  return (
    <article
      tabIndex={0}
      className={className}
      data-reveal={revealOrder}
      data-active={active ? "" : undefined}
      onClick={handleClick}
    >
      {children}
    </article>
  );
}
