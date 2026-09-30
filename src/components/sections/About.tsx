import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/content";

export function About() {
  const { about } = siteContent;

  return (
    <Section id={about.id} className="bg-brand-light">
      {/* Foto (5 partes) + texto (7 partes); una sola columna hasta 860px */}
      <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-[clamp(2rem,6vw,5rem)] max-md:grid-cols-1">
        {about.image && (
          <Image
            src={about.image}
            alt={about.title}
            width={400}
            height={400}
            loading="eager"
            data-reveal={0}
            // Recorte 4:5 con el encuadre corrido a la derecha (72%), como el original
            className="aspect-[4/5] w-full rounded-card object-cover object-[72%_center] max-md:max-w-[360px]"
          />
        )}

        <div>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} className="mb-6" />

          {about.paragraphs.map((paragraph, index) => (
            // Margen de párrafo del navegador (1em), que el original conserva.
            // Aparición: la etiqueta es el paso 0 del grupo, los párrafos siguen (1, 2, 3...)
            <p key={paragraph} className="my-[1em]" data-reveal={Math.min(index + 1, 6)}>
              {paragraph}
            </p>
          ))}

          <ul className="mt-8 grid grid-cols-3 gap-4 max-sm:grid-cols-1">
            {about.facts.map((fact, index) => (
              <li key={fact.label} data-reveal={Math.min(index, 6)} className="border-l-[3px] border-brand pl-4">
                <strong className="mb-1 block text-[1.35rem] leading-[1.2] font-black text-brand">
                  {fact.value}
                </strong>
                <span className="block text-[0.9rem] leading-[1.35] text-ink-muted">{fact.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
