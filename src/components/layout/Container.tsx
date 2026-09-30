import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Contenedor principal del sitio (.container del original): 1120px máx. y 20px de margen lateral. */
export function Container({ children, className = "" }: ContainerProps) {
  return <div className={`site-container ${className}`}>{children}</div>;
}
