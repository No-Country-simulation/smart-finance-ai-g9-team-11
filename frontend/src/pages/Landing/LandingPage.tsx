import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { TeamSection } from "@/components/landing/TeamSection/TeamSection";
import { TechnologySection } from "@/components/landing/TechnologySection";
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
        <TechnologySection />
        <TeamSection />
        <LandingCTA />
      </main>

      <LandingFooter />
    </div>
  );
}