"use client";

import { useEffect } from "react";
import { REVEAL_PENDING_ATTRIBUTE } from "./revealPendingScript";

/**
 * Aparición suave al hacer scroll (migrado de js/main.js). No renderiza nada.
 *
 * - Elementos: los que llevan `data-reveal="<orden>"` en el HTML del servidor.
 *   El orden (0–6) escalona la entrada dentro de cada grupo: 90ms por paso.
 * - Al cargar se marcan como ocultos (data-reveal-state="hidden"); al entrar en pantalla
 *   pasan a "visible" y, al terminar la transición, se limpian para no interferir con los hover.
 * - Hasta que esto corre, el script inline del <head> (revealPendingScript.ts) ya los mantiene
 *   ocultos con <html data-reveal-pending>, para que no se vean un instante antes de ocultarse
 *   (por ejemplo al cargar directo en /#contacto). Al inicializarse, ScrollReveal quita esa marca.
 * - Con prefers-reduced-motion o sin IntersectionObserver no hace nada (todo visible).
 *   Sin JavaScript todo se ve normal. Estilos en globals.css.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      root.removeAttribute(REVEAL_PENDING_ATTRIBUTE);
      return;
    }

    // Si la marca ya no está (venció el tiempo de seguridad del script inline), el contenido
    // que está en pantalla ya se mostró: no se vuelve a ocultar, solo se anima lo que está más abajo.
    const pending = root.hasAttribute(REVEAL_PENDING_ATTRIBUTE);
    const alreadyShown = (element: HTMLElement) =>
      !pending && element.getBoundingClientRect().top < window.innerHeight;

    const targets: HTMLElement[] = [];
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      if (alreadyShown(element)) return;
      element.dataset.revealState = "hidden";
      element.style.setProperty("--orden", String(Math.min(Number(element.dataset.reveal), 6)));
      targets.push(element);
    });

    // El estado oculto se aplica al instante (sin animar la salida), como en el original, donde
    // main.js corre antes de pintar. Así el observer mide cada elemento ya desplazado 28px.
    // La marca del <head> se quita recién ahora, cuando data-reveal-state ya los mantiene ocultos.
    targets.forEach((element) => (element.style.transition = "none"));
    root.removeAttribute(REVEAL_PENDING_ATTRIBUTE);
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
  }, []);

  return null;
}
