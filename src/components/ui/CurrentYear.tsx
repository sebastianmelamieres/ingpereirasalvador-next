"use client";

import { useSyncExternalStore } from "react";

interface CurrentYearProps {
  /** Año del build (lo que queda en el HTML estático). */
  buildYear: number;
}

// El año no cambia mientras la página está abierta: no hay nada a qué suscribirse.
const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();

/**
 * Año actual (como js/main.js): el HTML sale con el año del build y, ya en el navegador,
 * se reemplaza por el año actual. Con useSyncExternalStore la hidratación usa el año del
 * build (igual al HTML, sin error de hidratación) y después React muestra el actual si cambió.
 */
export function CurrentYear({ buildYear }: CurrentYearProps) {
  return useSyncExternalStore(subscribe, getYear, () => buildYear);
}
