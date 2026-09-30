"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";

interface NavMenuProps {
  /** id del <nav>, referenciado por aria-controls del botón. */
  id: string;
  openLabel: string;
  closeLabel: string;
  /** Enlaces del menú (se renderizan en el servidor). */
  children: ReactNode;
}

/**
 * Parte interactiva del header: botón hamburguesa + <nav>.
 * En escritorio el <nav> se ve siempre y el botón está oculto; hasta 860px el <nav>
 * es un panel desplegable que se abre y cierra con el botón.
 */
export function NavMenu({ id, openLabel, closeLabel, children }: NavMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape cierra el menú y devuelve el foco al botón
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Cerrar el menú al elegir un enlace (también con teclado: Enter dispara "click")
  function handleNavClick(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
  }

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="group hidden size-11 cursor-pointer border-0 bg-transparent p-2.5 max-md:block"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="my-[5px] block h-0.5 rounded-[2px] bg-brand [transition:transform_.25s,opacity_.25s] group-aria-expanded:[transform:translateY(7px)_rotate(45deg)]" />
        <span className="my-[5px] block h-0.5 rounded-[2px] bg-brand [transition:transform_.25s,opacity_.25s] group-aria-expanded:opacity-0" />
        <span className="my-[5px] block h-0.5 rounded-[2px] bg-brand [transition:transform_.25s,opacity_.25s] group-aria-expanded:[transform:translateY(-7px)_rotate(-45deg)]" />
      </button>

      <nav
        id={id}
        data-open={open ? "" : undefined}
        onClick={handleNavClick}
        className={[
          "group flex items-center gap-8 md:max-lg:gap-5",
          // Hasta 860px: panel desplegable debajo del header
          "max-md:absolute max-md:inset-x-0 max-md:top-header max-md:flex-col max-md:items-stretch max-md:gap-0",
          "max-md:border-b max-md:border-line max-md:bg-white max-md:px-gutter max-md:pt-2 max-md:pb-5",
          "max-md:shadow-[0_16px_30px_-18px_rgba(26,29,41,.35)]",
          // Cerrado: invisible y un poco más arriba; "visibility" espera al fundido (y lo saca del foco)
          "max-md:invisible max-md:-translate-y-2.5 max-md:opacity-0",
          "max-md:[transition:opacity_.25s_ease,translate_.3s_ease,visibility_0s_linear_.3s]",
          "max-md:data-open:visible max-md:data-open:translate-y-0 max-md:data-open:opacity-100",
          "max-md:data-open:[transition:opacity_.25s_ease,translate_.35s_cubic-bezier(.2,.7,.2,1),visibility_0s]",
        ].join(" ")}
      >
        {children}
      </nav>
    </>
  );
}
