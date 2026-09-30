"use client";

import { useEffect } from "react";

interface ScrollRevealProps {
  /** Selectores de elementos que no llevan data-reveal en su markup (entran con orden 0). */
  extraTargets?: string[];
}

/**
 * Aparición suave al hacer scroll (migrado de js/main.js). No renderiza nada.
 *
 * - Elementos: los que llevan `data-reveal="<orden>"` en el HTML del servidor, más `extraTargets`.
 *   El orden (0–6) escalona la entrada dentro de cada grupo: 90ms por paso.
 * - Al cargar se marcan como ocultos (data-reveal-state="hidden"); al entrar en pantalla
 *   pasan a "visible" y, al terminar la transición, se limpian para no interferir con los hover.
 * - Con prefers-reduced-motion o sin IntersectionObserver no hace nada (todo visible).
 *   Sin JavaScript todo se ve normal. Estilos en globals.css.
 */
export function ScrollReveal({ extraTargets = [] }: ScrollRevealProps) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;

    const targets: HTMLElement[] = [];
    const prepare = (element: HTMLElement, order: number) => {
      element.dataset.revealState = "hidden";
      element.style.setProperty("--orden", String(Math.min(order, 6)));
      targets.push(element);
    };
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      prepare(element, Number(element.dataset.reveal));
    });
    for (const selector of extraTargets) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => prepare(element, 0));
    }

    // El estado oculto se aplica al instante (sin animar la salida), como en el original, donde
    // main.js corre antes de pintar. Así el observer mide cada elemento ya desplazado 28px.
    targets.forEach((element) => (element.style.transition = "none"));
    document.body.getBoundingClientRect();
    targets.forEach((element) => element.style.removeProperty("transition"));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target;
          if (!entry.isIntersecting || !(element instanceof HTMLElement)) continue;
          element.dataset.revealState = "visible";
          observer.unobserve(element);
          element.addEventListener(
            "transitionend",
            () => {
              delete element.dataset.revealState;
              element.style.removeProperty("--orden");
            },
            { once: true },
          );
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [extraTargets]);

  return null;
}
