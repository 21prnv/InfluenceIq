import { Hero } from "@/components/ui/hero"
import { Features } from "@/components/ui/features"
import { CallToAction } from "@/components/ui/cta"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <CallToAction />
    </main>
  )
}
