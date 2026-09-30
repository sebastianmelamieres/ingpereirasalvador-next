import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Arcs } from "@/components/ui/Arcs";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { siteContent } from "@/content";

// Tamaño de los arcos (los mismos de la portada)
const arcsClasses = "pointer-events-none absolute w-[clamp(160px,24vw,340px)] opacity-95 max-sm:w-[120px]";

/**
 * Página 404 (static export: out/404.html, que Netlify sirve para rutas inexistentes).
 * Next le agrega <meta name="robots" content="noindex"> automáticamente.
 * El <title> se declara acá porque la metadata de la home está en page.tsx y no se hereda.
 */
export default function NotFound() {
  const { notFound, site } = siteContent;

  return (
    <>
      <title>{`${notFound.title} | ${site.name}`}</title>
      <main className="relative flex min-h-svh items-center overflow-hidden bg-brand py-28 text-white [&_:focus-visible]:outline-white">
        <Arcs className={`${arcsClasses} top-0 left-0`} />
        <Arcs late className={`${arcsClasses} right-0 bottom-0 rotate-180`} />

        <Container className="relative max-w-[820px]! text-center">
          <Image src={site.logo.inverted} alt={site.name} width={160} height={46} className="mx-auto mb-10 h-10 w-auto" />
          <Eyebrow light>{notFound.eyebrow}</Eyebrow>
          <h1 className="mb-6 text-[clamp(2.3rem,6vw,4.2rem)] font-black tracking-[-0.01em]">{notFound.title}</h1>
          <p className="mx-auto mb-9 max-w-[620px] text-[clamp(1.05rem,2vw,1.25rem)] text-white/88">{notFound.text}</p>
          <ButtonLink variant="white" href="/" className="max-sm:w-full">
            {notFound.homeCta}
          </ButtonLink>
        </Container>
      </main>
    </>
  );
}
