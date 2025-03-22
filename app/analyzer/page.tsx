import { InstagramAnalyzer } from "@/components/ui/instagram-analyzer"
import { Waves } from "@/components/ui/waves-background"

export default function AnalyzerPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <div className="absolute inset-0 opacity-30">
        <Waves />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-16">
        <InstagramAnalyzer />
      </div>
    </main>
  )
} 