import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/layout/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { AiSection } from "@/components/landing/ai-section";
import { PmkvySection } from "@/components/landing/pmkvy-section";
import { FaqSection } from "@/components/landing/faq-section";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <FeaturesSection />
        <AiSection />
        <PmkvySection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
