import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

/**
 * Botones tipo pill del sitio (.btn del original).
 * - `ButtonLink`: navegación (<a>), por ejemplo WhatsApp o un ancla.
 * - `Button`: acciones (<button>), por ejemplo enviar el formulario.
 * Comparten el aspecto a través de `buttonClasses`.
 */
export type ButtonVariant = "primary" | "white" | "outlineLight" | "formSubmit";

const base =
  "inline-flex items-center justify-center gap-[0.5em] rounded-full px-[1.5em] py-[0.9em] font-[inherit] text-[1rem] font-bold no-underline transition-[background-color,color,border-color,translate] duration-200 hover:-translate-y-px";

const variants: Record<ButtonVariant, string> = {
  // .btn--primary
  primary: "border-2 border-transparent bg-brand text-white hover:bg-brand-dark",
  // .btn--white
  white: "border-2 border-transparent bg-white text-brand hover:bg-brand-light",
  // .btn--outline-light
  outlineLight: "border-2 border-white/70 text-white hover:border-white hover:bg-white/12",
  // .form__submit: blanco y sin borde. Al deshabilitarse (enviando) queda semitransparente y sin elevación.
  formSubmit:
    "cursor-pointer border-0 bg-white text-brand hover:bg-brand-light disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0",
};

export function buttonClasses(variant: ButtonVariant, className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant: ButtonVariant;
};

export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <a className={buttonClasses(variant, className)} {...props} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant;
};

export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}
