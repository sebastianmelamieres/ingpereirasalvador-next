import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard, serviceCardBase } from "@/components/ui/ServiceCard";
import { siteContent } from "@/content";

export function Services() {
  const { services } = siteContent;

  return (
    <>
      {/* Franja de rayas (textura de marca): transición entre la portada (azul) y Servicios (celeste) */}
      <div
        aria-hidden="true"
        className="h-6 bg-[repeating-linear-gradient(to_bottom,var(--color-brand)_0_3px,var(--color-brand-light)_3px_7px)]"
      />

      <Section id={services.id} className="bg-brand-light">
        <SectionHeading eyebrow={services.eyebrow} title={services.title} className="mb-10" />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
          {/* Las tarjetas aparecen escalonadas (orden = posición, máx. 6; la tarjeta final también) */}
          {services.items.map((service, index) => (
            <ServiceCard key={service.title} service={service} revealOrder={Math.min(index, 6)} />
          ))}

          {/* Tarjeta final: invita a escribir por otro proyecto */}
          <a
            data-reveal={Math.min(services.items.length, 6)}
            href={services.closingCard.href}
            className={`${serviceCardBase} flex flex-col justify-center bg-brand text-white no-underline focus-visible:outline-white`}
          >
            <h3 className="mb-[0.6rem] text-[1.3rem] font-bold">{services.closingCard.title}</h3>
            <p className="text-[1.0625rem] text-white/85">{services.closingCard.description}</p>
            <span className="mt-4 text-[1.6rem] font-bold" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </Section>
    </>
  );
}
