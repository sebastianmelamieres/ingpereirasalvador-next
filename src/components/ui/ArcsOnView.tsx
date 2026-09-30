"use client";

import { useEffect, useRef, useState } from "react";
import { Arcs } from "./Arcs";
import styles from "./Arcs.module.css";

interface ArcsOnViewProps {
  className?: string;
}

/**
 * Arcos cuya animación arranca cuando entran en pantalla (30% visibles), como los de
 * la sección de contacto en js/main.js. El HTML sale pausado; sin JavaScript,
 * el <noscript> quita la pausa para que los arcos se animen igual.
 */
export function ArcsOnView({ className }: ArcsOnViewProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Arcs ref={ref} paused={!visible} className={className} />
      <noscript>
        <style>{`.${styles.paused} circle { animation-play-state: running; }`}</style>
      </noscript>
    </>
  );
}
