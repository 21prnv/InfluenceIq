import { InstagramAnalyzer } from "@/components/ui/instagram-analyzer"
import { Waves } from "@/components/ui/waves-background"

export default function AnalyzerPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <div className="absolute top-0 z-[0] h-screen w-screen bg-purple-900/20 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <InstagramAnalyzer />
      </div>
    </main>
  )
} 