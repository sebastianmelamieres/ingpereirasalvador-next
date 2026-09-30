import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { siteContent } from "@/content";

// El formulario de contacto y su botón de envío también aparecen al hacer scroll (orden 0),
// pero se seleccionan desde acá para no tocar ContactForm.tsx.
const contactId = siteContent.contactSection.id;
const revealExtraTargets = [`#${contactId} form`, `#${contactId} form button[type="submit"]`];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollReveal extraTargets={revealExtraTargets} />
    </>
  );
}
