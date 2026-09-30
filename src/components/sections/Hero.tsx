import { Container } from "@/components/layout/Container";
import { Arcs } from "@/components/ui/Arcs";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { siteContent } from "@/content";
import { whatsappHref } from "@/content/links";
import styles from "./Hero.module.css";

// Tamaño de los arcos de la portada (120px hasta 520px)
const arcsClasses = "pointer-events-none absolute w-[clamp(160px,24vw,340px)] opacity-95 max-sm:w-[120px]";

export function Hero() {
  const { hero, contact } = siteContent;

  return (
    <section
      id={hero.id}
      // scroll-mt-px compensa el borde de 1px del header: "#inicio" lleva al tope de la página, como el original
      className="relative scroll-mt-px overflow-hidden bg-brand py-[clamp(5rem,12vw,9rem)] text-white max-sm:py-28 [&_:focus-visible]:outline-white"
    >
      <Arcs className={`${arcsClasses} top-0 left-0`} />
      <Arcs late className={`${arcsClasses} right-0 bottom-0 rotate-180`} />

      <Container className="relative max-w-[820px]! text-center">
        <Eyebrow light className={`${styles.enter} ${styles.eyebrow}`}>
          {hero.eyebrow}
        </Eyebrow>
        <h1
          className={`${styles.enter} ${styles.title} mb-6 text-[clamp(2.3rem,6vw,4.2rem)] font-black tracking-[-0.01em]`}
        >
          {hero.title}
        </h1>
        <p
          className={`${styles.enter} ${styles.text} mx-auto mb-9 max-w-[620px] text-[clamp(1.05rem,2vw,1.25rem)] text-white/88`}
        >
          {hero.text}
        </p>
        <div className={`${styles.enter} ${styles.actions} flex flex-wrap justify-center gap-4`}>
          <ButtonLink
            variant="white"
            href={whatsappHref(contact)}
            target="_blank"
            rel="noopener"
            className="max-sm:w-full"
          >
            {hero.whatsappCta}
          </ButtonLink>
          <ButtonLink variant="outlineLight" href={hero.secondaryCta.href} className="max-sm:w-full">
            {hero.secondaryCta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
