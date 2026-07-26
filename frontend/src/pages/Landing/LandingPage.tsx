import { HeroSection } from "@/components/landing/HeroSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { cn } from "@/lib/utils";

export function LandingPage() {
  return (
    <div
      className={cn(
        "relative min-h-dvh",
        "overflow-x-hidden",
        "bg-background text-text",
      )}
    >
      <LandingHeader />

      <main>
        <HeroSection />

        <section
          id="beneficios"
          className="scroll-mt-24"
          aria-label="Benefícios do Finance AI"
        />

        <section
          id="como-funciona"
          className="scroll-mt-24"
          aria-label="Como funciona o Finance AI"
        />

        <section
          id="recursos"
          className="scroll-mt-24"
          aria-label="Recursos do Finance AI"
        />

        <section
          id="equipe"
          className="scroll-mt-24"
          aria-label="Equipe do Finance AI"
        />
      </main>
    </div>
  );
}