import { ButtonLink } from "@/components/ui/Button";
import { ArcsOnView } from "@/components/ui/ArcsOnView";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/content";
import { emailHref, phoneHref, whatsappHref } from "@/content/links";
import { ContactForm } from "./ContactForm";

const itemClasses = "rounded-card border border-white/20 bg-brand px-[1.4rem] py-[1.1rem]";
const labelClasses = "mb-[0.2rem] block text-[0.8rem] font-bold tracking-[0.1em] text-white/70 uppercase";
const linkClasses = "text-[1.15rem] font-bold no-underline [word-break:break-word] [&:hover]:underline";

export function Contact() {
  const { contactSection: section, contact, contactForm, services } = siteContent;

  return (
    <Section
      id={section.id}
      className="relative overflow-hidden bg-brand text-white max-sm:pb-32 [&_:focus-visible]:outline-white"
    >
      <ArcsOnView className="pointer-events-none absolute right-0 bottom-0 w-[clamp(160px,22vw,300px)] rotate-180 opacity-90 max-sm:w-[120px]" />

      <div className="relative grid grid-cols-[1fr_1fr] items-center gap-12 max-md:grid-cols-1">
        <div>
          <SectionHeading light eyebrow={section.eyebrow} title={section.title} className="mb-4" />
          {/* Aparece después de la etiqueta (0) y el título (1) */}
          <p className="mb-8 text-[1.15rem] text-white/88" data-reveal={2}>
            {section.text}
          </p>
          <ButtonLink variant="white" href={whatsappHref(contact)} target="_blank" rel="noopener" data-reveal={0}>
            {section.whatsappCta}
          </ButtonLink>

          <ul className="mt-10 grid gap-3">
            <li className={itemClasses} data-reveal={0}>
              <span className={labelClasses}>{section.labels.phone}</span>
              <a href={phoneHref(contact)} className={linkClasses}>
                {contact.phone.display}
              </a>
            </li>
            <li className={itemClasses} data-reveal={1}>
              <span className={labelClasses}>{section.labels.email}</span>
              <a href={emailHref(contact)} className={linkClasses}>
                {contact.email}
              </a>
            </li>
            {contact.area && (
              <li className={itemClasses} data-reveal={2}>
                <span className={labelClasses}>{section.labels.area}</span>
                <span>{contact.area}</span>
              </li>
            )}
          </ul>
        </div>

        <ContactForm content={contactForm} serviceOptions={services.items.map((service) => service.title)} />
      </div>
    </Section>
  );
}
