import type { Ref } from "react";
import styles from "./Arcs.module.css";

// Siete anillos concéntricos con centro en la esquina superior izquierda del SVG;
// se ve solo un cuarto de cada uno.
const radii = [600, 564, 528, 492, 456, 420, 384];

interface ArcsProps {
  /** Posición, tamaño y rotación (cada uso lo define). */
  className?: string;
  /** Retrasa la animación (segundo juego de arcos de la portada). */
  late?: boolean;
  /** Animación en pausa hasta que se indique lo contrario (arcos de contacto, ver ArcsOnView). */
  paused?: boolean;
  ref?: Ref<SVGSVGElement>;
}

/** Arcos decorativos animados (solo SVG + CSS). Ocultos para lectores de pantalla. */
export function Arcs({ className = "", late = false, paused = false, ref }: ArcsProps) {
  return (
    <svg
      ref={ref}
      className={`${styles.arcs} ${late ? styles.late : ""} ${paused ? styles.paused : ""} ${className}`}
      viewBox="0 0 618 618"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={18}
      aria-hidden="true"
    >
      {radii.map((r) => (
        <circle key={r} cx={0} cy={0} r={r} pathLength={100} />
      ))}
    </svg>
  );
}
