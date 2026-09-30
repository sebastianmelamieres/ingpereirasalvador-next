"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { ContactForm as ContactFormContent } from "@/content";

/**
 * Formulario de contacto (Netlify Forms).
 *
 * Netlify detecta el formulario en su gemelo estático public/__forms.html (con data-netlify).
 * Este formulario NO lleva data-netlify: así Netlify no reescribe su HTML y React lo hidrata tal cual.
 * Netlify asocia cada envío por el campo oculto "form-name".
 *
 * IMPORTANTE: el nombre del formulario y los `name` de los campos deben coincidir con
 * public/__forms.html (lo verifica scripts/validate-content.mjs en cada build).
 */
const FORM_NAME = "contacto";

type Status = "idle" | "sending" | "success" | "error";

interface ContactFormProps {
  content: ContactFormContent;
  /** Opciones del selector: títulos de los servicios (el último, "Otro", sale del contenido). */
  serviceOptions: string[];
}

const fieldClasses = "grid gap-[0.35rem]";
const labelClasses = "text-[0.9rem] font-bold text-white/90";
// Campos: fondo blanco al 95%, borde transparente de 1.5px; con foco, fondo blanco y halo
const inputClasses =
  "w-full rounded-[10px] border-[1.5px] border-transparent bg-white/95 px-[0.9rem] py-3 text-[1rem] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-[#757575] focus:border-white focus:bg-white focus:shadow-[0_0_0_3px_rgba(255,255,255,.35)] focus:outline-none";

export function ContactForm({ content, serviceOptions }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const { fields } = content;

  // Envío sin recargar la página (igual que js/main.js). Solo se llega acá si pasó la validación nativa.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    const body = new URLSearchParams();
    for (const [name, value] of new FormData(form)) {
      if (typeof value === "string") body.append(name, value);
    }

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const statusMessage =
    status === "success" ? content.successMessage : status === "error" ? content.errorMessage : "";
  const statusColor = status === "success" ? "text-[#c9f7d9]" : status === "error" ? "text-[#ffd4cf]" : "";

  return (
    <form
      name={FORM_NAME}
      method="POST"
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-card border border-white/25 bg-[#3f58a0] p-[clamp(1.5rem,4vw,2.25rem)] text-white"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      {/* Trampa para bots (honeypot): fuera de pantalla; si llega completo, Netlify lo marca como spam */}
      <p className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          {content.honeypotLabel} <input name="empresa-web" tabIndex={-1} autoComplete="off" className={inputClasses} />
        </label>
      </p>

      <h3 className="mb-1 text-[1.5rem] font-black text-white">{content.title}</h3>

      <div className={fieldClasses}>
        <label htmlFor="f-nombre" className={labelClasses}>
          {fields.name.label}
        </label>
        <input id="f-nombre" name="nombre" type="text" autoComplete="name" required className={inputClasses} />
      </div>
      <div className="grid grid-cols-[1fr_1fr] gap-4 max-sm:grid-cols-1">
        <div className={fieldClasses}>
          <label htmlFor="f-email" className={labelClasses}>
            {fields.email.label}
          </label>
          <input id="f-email" name="email" type="email" autoComplete="email" required className={inputClasses} />
        </div>
        <div className={fieldClasses}>
          <label htmlFor="f-telefono" className={labelClasses}>
            {fields.phone.label}
          </label>
          <input id="f-telefono" name="telefono" type="tel" autoComplete="tel" className={inputClasses} />
        </div>
      </div>
      <div className={fieldClasses}>
        <label htmlFor="f-servicio" className={labelClasses}>
          {fields.service.label}
        </label>
        <select id="f-servicio" name="servicio" className={inputClasses}>
          {serviceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
          <option>{fields.service.otherOption}</option>
        </select>
      </div>
      <div className={fieldClasses}>
        <label htmlFor="f-mensaje" className={labelClasses}>
          {fields.message.label}
        </label>
        <textarea
          id="f-mensaje"
          name="mensaje"
          rows={4}
          placeholder={fields.message.placeholder}
          required
          className={`${inputClasses} min-h-[110px] resize-y`}
        />
      </div>

      <Button
        type="submit"
        variant="formSubmit"
        disabled={status === "sending"}
        // Un <button> no hereda el interlineado del texto (line-height: normal), como en el original
        className="justify-self-start leading-[normal] max-sm:w-full max-sm:justify-self-stretch"
      >
        {status === "sending" ? content.sendingLabel : content.submitLabel}
      </Button>
      <p className={`min-h-[1.5em] font-bold ${statusColor}`} role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );
}
