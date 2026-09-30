import Image from "next/image";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { navigationItems, siteContent } from "@/content";
import { emailHref, phoneHref, whatsappHref } from "@/content/links";
import { Container } from "./Container";

const columnClasses = "flex flex-col items-start gap-[0.55rem]";
const titleClasses = "mb-[0.35rem] text-[0.8rem] font-bold tracking-[0.1em] text-white uppercase";
// .footer__col a / span
const itemClasses = "text-[0.95rem] no-underline [word-break:break-word]";
const linkClasses = `${itemClasses} [&:hover]:text-white [&:hover]:underline`;

export function Footer() {
  const { site, hero, contact, navigation, footer } = siteContent;
  // Año del build: queda en el HTML estático (CurrentYear lo actualiza en el navegador)
  const buildYear = new Date().getFullYear();

  return (
    <footer className="bg-black pt-14 pb-8 text-[0.9rem] text-white/70 max-sm:pb-[5.5rem] [&_:focus-visible]:outline-white">
      <Container className="grid grid-cols-[2fr_1fr_1.3fr] gap-10 pb-10 max-md:grid-cols-[1fr_1fr] max-sm:grid-cols-1 max-sm:gap-8">
        <div className="max-md:col-span-full">
          <Image
            src={site.logo.inverted}
            alt={site.name}
            width={160}
            height={46}
            className="h-10 w-auto"
          />
          <p className="mt-4">{hero.eyebrow}</p>
        </div>

        <nav className={columnClasses} aria-label={footer.navigationAriaLabel}>
          <p className={titleClasses}>{footer.navigationTitle}</p>
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href} className={linkClasses}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={columnClasses}>
          <p className={titleClasses}>{footer.contactTitle}</p>
          <a href={whatsappHref(contact)} target="_blank" rel="noopener" className={linkClasses}>
            {navigation.whatsappLabel}
          </a>
          <a href={phoneHref(contact)} className={linkClasses}>
            {contact.phone.display}
          </a>
          <a href={emailHref(contact)} className={linkClasses}>
            {contact.email}
          </a>
          {contact.area && <span className={itemClasses}>{contact.area}</span>}
        </div>
      </Container>

      <Container className="border-t border-white/15 pt-6">
        {/* Misma estructura que el original ("© " + <span>año</span> + " texto") */}
        <p>
          {"© "}
          <span>
            <CurrentYear buildYear={buildYear} />
          </span>
          {` ${footer.text}`}
        </p>
      </Container>
    </footer>
  );
}
