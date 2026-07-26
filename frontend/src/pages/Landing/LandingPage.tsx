import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
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
        <BenefitsSection />
        <HowItWorksSection />
        <FeaturesSection />

        <section
          id="equipe"
          className="scroll-mt-24"
          aria-label="Equipe do Finance AI"
        />
      </main>
    </div>
  );
}