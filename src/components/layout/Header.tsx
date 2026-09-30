import Image from "next/image";
import { navigationItems, siteContent } from "@/content";
import { Container } from "./Container";
import { NavMenu } from "./NavMenu";

// Al abrir el menú móvil los enlaces entran escalonados (50ms entre cada uno, hasta el 6º)
const openDelays = [
  "max-md:group-data-open:delay-50",
  "max-md:group-data-open:delay-100",
  "max-md:group-data-open:delay-150",
  "max-md:group-data-open:delay-200",
  "max-md:group-data-open:delay-250",
  "max-md:group-data-open:delay-300",
];

const linkClasses = [
  "font-bold text-ink no-underline transition-[color] duration-200 hover:text-brand",
  // Hasta 860px: filas del panel, ocultas hasta que se abre el menú
  "max-md:border-b max-md:border-line max-md:py-[0.9rem]",
  "max-md:-translate-y-1.5 max-md:opacity-0 max-md:[transition:opacity_.25s_ease,translate_.3s_ease,color_.2s]",
  "max-md:group-data-open:translate-y-0 max-md:group-data-open:opacity-100",
].join(" ");

export function Header() {
  const { navigation, site } = siteContent;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/96 backdrop-blur-[8px]">
      <Container className="flex h-header items-center justify-between">
        <a href={navigation.homeHref} aria-label={navigation.homeLabel}>
          <Image
            src={site.logo.default}
            alt={navigation.logoAlt}
            width={180}
            height={52}
            loading="eager"
            className="h-[46px] w-auto max-sm:h-[38px]"
          />
        </a>

        <NavMenu id="nav" openLabel={navigation.openMenuLabel} closeLabel={navigation.closeMenuLabel}>
          {navigationItems.map((item, index) => (
            <a key={item.href} href={item.href} className={`${linkClasses} ${openDelays[index] ?? ""}`}>
              {item.label}
            </a>
          ))}
        </NavMenu>
      </Container>
    </header>
  );
}
