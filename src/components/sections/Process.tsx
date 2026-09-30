import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/content";
import { whatsappHref } from "@/content/links";

// Línea que une los pasos: horizontal en escritorio (del centro del primer número al del último)
// y vertical, a la altura de los números, hasta 860px.
const connector = [
  "before:absolute before:top-7 before:left-7 before:h-0.5 before:bg-white/30",
  "before:right-[calc((100%-6rem)/4-28px)]",
  "max-md:before:right-auto max-md:before:bottom-7 max-md:before:left-[27px] max-md:before:h-auto max-md:before:w-0.5",
].join(" ");

export function Process() {
  const { process, contact } = siteContent;

  return (
    <Section id={process.id} className="bg-brand text-white [&_:focus-visible]:outline-white">
      <SectionHeading
        light
        eyebrow={process.eyebrow}
        title={process.title}
        className="mb-10"
        titleClassName="max-w-[720px]"
      />

      <ol className={`relative grid grid-cols-4 gap-8 max-md:grid-cols-1 max-md:gap-7 ${connector}`}>
        {process.steps.map((step, index) => (
          // Hasta 860px: número a la izquierda, título y texto a la derecha
          <li key={step.title} data-reveal={Math.min(index, 6)} className="relative max-md:grid max-md:grid-cols-[56px_1fr] max-md:gap-x-5">
            <span className="relative mb-5 grid size-14 place-items-center rounded-[50%] bg-white text-[1.15rem] font-black text-brand shadow-[0_0_0_8px_var(--color-brand)] max-md:row-span-2 max-md:mb-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mb-2 text-[1.2rem] font-bold max-md:mt-[0.35rem] max-md:self-end">{step.title}</h3>
            <p className="text-[1rem] text-white/85">{step.description}</p>
          </li>
        ))}
      </ol>

      <ButtonLink
        variant="white"
        href={whatsappHref(contact)}
        target="_blank"
        rel="noopener"
        className="mt-11"
        data-reveal={0}
      >
        {process.whatsappCta}
      </ButtonLink>
    </Section>
  );
}
