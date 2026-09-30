"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { ContactForm as ContactFormContent } from "@/content";

/**
 * Formulario de contacto (Web3Forms: los envíos llegan por mail, sin backend propio).
 *
 * Se envía por fetch (JSON) a la API de Web3Forms con la clave pública del formulario, que se toma de
 * NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY en el build (Next la incrusta en el JS). Web3Forms usa el campo
 * "email" como reply-to y descarta los envíos con "botcheck" marcado (honeypot).
 *
 * El dominio de la API está habilitado en la CSP (connect-src, scripts/generate-headers.mjs).
 */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
const EMAIL_SUBJECT = "Nueva consulta desde el sitio web";

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

  // Envío sin recargar la página. Solo se llega acá si pasó la validación nativa.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    // "botcheck" solo viaja si un bot lo marcó (un checkbox sin marcar no entra en el FormData)
    const data = Object.fromEntries(new FormData(form));

    try {
      if (!ACCESS_KEY) throw new Error("Falta NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY");
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          access_key: ACCESS_KEY,
          subject: EMAIL_SUBJECT,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { success?: boolean };
      if (!response.ok || !result.success) throw new Error(String(response.status));
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
      method="POST"
      onSubmit={handleSubmit}
      data-reveal={0}
      className="grid gap-4 rounded-card border border-white/25 bg-[#3f58a0] p-[clamp(1.5rem,4vw,2.25rem)] text-white"
    >
      {/* Trampa para bots (honeypot): fuera de pantalla; si llega marcado, Web3Forms descarta el envío */}
      <p className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          {content.honeypotLabel} <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
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
        data-reveal={0}
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
