import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { SocialMetaTags } from "@/components/layout/SocialMetaTags";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { siteContent } from "@/content";
import { professionalServiceJsonLd, serializeJsonLd } from "@/content/structured-data";

// Title y description (los del original), desde site.json
export const metadata: Metadata = {
  title: siteContent.site.title,
  description: siteContent.site.description,
};

export default function Home() {
  return (
    <>
      {/* Canonical, Open Graph y Twitter (React los ubica en el <head>) */}
      <SocialMetaTags />
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
      <ScrollReveal />
      {/* Datos estructurados para Google (schema.org), generados en el build a partir de site.json */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(professionalServiceJsonLd()) }}
      />
    </>
  );
}
