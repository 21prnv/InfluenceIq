import { Waves } from "./waves-background"
import Link from "next/link"
import { StarBorder } from "./star-border"

export function CallToAction() {
  return (
    <section className="relative py-24 overflow-hidden bg-black">
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Ready to Lead the Change?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join us in redefining fame—fairly, intelligently, and transparently. 
          Be part of the revolution that measures true influence.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <StarBorder 
            as={Link}
            href="/analyzer"
            className="inline-flex items-center justify-center font-semibold hover:opacity-90 transition-opacity"
            color="hsl(var(--primary))"
          >
            Join the Waitlist
          </StarBorder>
          <StarBorder 
            as={Link}
            href="/contact"
            className="inline-flex items-center justify-center font-semibold hover:opacity-90 transition-opacity"
            color="hsl(var(--muted-foreground))"
          >
            Request Demo
          </StarBorder>
        </div>
      </div>
    </section>
  )
} 