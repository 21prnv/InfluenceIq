import { Features } from "@/components/ui/features"
import { CallToAction } from "@/components/ui/cta"
import { HeroSection } from "@/components/blocks/hero-section-dark"
import { Gallery4Demo } from "@/components/blocks/profile"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HeroSection />
      <Gallery4Demo />
      <Features />
      <CallToAction />
    </main>
  )
}
