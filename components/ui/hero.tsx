import { Waves } from "./waves-background"
import Link from "next/link"

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <Waves className="opacity-30" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6">
          InfluenceIQ
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The AI-Powered System That Ranks Who Really Matters
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/analyzer">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </Link>
          <button className="px-8 py-3 rounded-full border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
} 