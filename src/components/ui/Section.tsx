import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

interface SectionProps {
  /** Ancla de la sección (viene de site.json). */
  id?: string;
  /** Fondo y color de texto de la sección, por ejemplo "bg-brand-light". */
  className?: string;
  children: ReactNode;
}

/** Estructura común de una sección (.section del original): padding vertical y contenedor. */
export function Section({ id, className = "", children }: SectionProps) {
  return (
    <section id={id} className={`py-section ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
