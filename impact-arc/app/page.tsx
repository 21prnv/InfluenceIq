import { Features } from "@/components/ui/features"
import { CallToAction } from "@/components/ui/cta"
import { HeroSection } from "@/components/blocks/hero-section-dark"
import { ProfileGalleryDemo } from "@/components/blocks/profile"
import Filter from "@/components/blocks/filter"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HeroSection />
      <ProfileGalleryDemo />
      <Filter />
      <Features />
      <CallToAction />

    </main>
  )
}
