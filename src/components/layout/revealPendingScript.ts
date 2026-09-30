/**
 * Script inline (en el <head>) que evita el "flash" del Scroll Reveal.
 *
 * Corre antes del primer pintado del body: si el reveal va a funcionar (sin movimiento
 * reducido y con IntersectionObserver), marca <html data-reveal-pending> y el CSS mantiene
 * ocultos los [data-reveal] hasta que ScrollReveal los procesa y quita la marca.
 *
 * - Sin JavaScript o con movimiento reducido no se marca nada: todo visible.
 * - No toca className (lo maneja React): solo un atributo propio.
 * - Espera acotada: la marca se quita sola REVEAL_GRACE_MS después del primer pintado del
 *   contenido (primer frame tras DOMContentLoaded). Si el JS llega antes (lo normal: ~20–300ms),
 *   el reveal funciona igual que el original. Si no (red lenta), el contenido se muestra sin
 *   animar en vez de quedar oculto hasta que llegue el JS; ScrollReveal no vuelve a ocultar lo
 *   que ya está en pantalla (ver ScrollReveal.tsx), así que tampoco hay flash.
 * - REVEAL_FALLBACK_MAX_MS: tope por si no hay frames (por ejemplo, pestaña en segundo plano).
 *
 * La CSP lo habilita por hash (scripts/generate-headers.mjs lo calcula del HTML generado),
 * así que cualquier cambio en este texto se refleja solo en el próximo build.
 */
export const REVEAL_PENDING_ATTRIBUTE = "data-reveal-pending";

const REVEAL_GRACE_MS = 1000;
const REVEAL_FALLBACK_MAX_MS = 8000;

export const revealPendingScript =
  `(function(){var d=document.documentElement,w=window;` +
  `if(!w.matchMedia||w.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver"in w))return;` +
  `d.setAttribute("${REVEAL_PENDING_ATTRIBUTE}","");` +
  `function r(){d.removeAttribute("${REVEAL_PENDING_ATTRIBUTE}")}` +
  `function g(){w.requestAnimationFrame(function(){setTimeout(r,${REVEAL_GRACE_MS})})}` +
  `setTimeout(r,${REVEAL_FALLBACK_MAX_MS});` +
  `document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g()})()`;
