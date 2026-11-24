import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/layout/hero-section";
import { Footer } from "@/components/layout/footer";
import { ApiStatus } from "@/components/shared/api-status";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        {/* Phase 1: Development status indicator */}
        <section className="max-w-5xl mx-auto px-6 py-12">
          <ApiStatus />
        </section>
      </main>
      <Footer />
    </div>
  );
}
