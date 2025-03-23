import { Waves } from "./waves-background"
import Link from "next/link"
import { StarBorder } from "./star-border"

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      <Waves className="absolute inset-0 opacity-30" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="bg-clip-text bg-gradient-to-br from-white via-30% via-white to-white/30 mx-2 font-medium text-[40px] text-transparent md:text-[72px] text-center leading-[60px] md:leading-[82px] relative z-10">
          ImpactArc
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The AI-Powered System That Ranks Who Really Matters
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <StarBorder 
            as={Link}
            href="/analyzer"
            className="inline-flex items-center justify-center font-semibold hover:opacity-90 transition-opacity"
            color="hsl(var(--primary))"
          >
            Get Started
          </StarBorder>
          <StarBorder 
            as={Link}
            href="#learn-more"
            className="inline-flex items-center justify-center font-semibold hover:opacity-90 transition-opacity"
            color="hsl(var(--muted-foreground))"
          >
            Learn More
          </StarBorder>
        </div>
      </div>
    </div>
  )
} 