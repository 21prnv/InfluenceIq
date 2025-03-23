import Link from "next/link"
import { StarBorder } from "./star-border"

export function Nav() {
  return (
    <nav className="relative bg-transparent border-b border-gray-800/30">
      <div className="absolute inset-0 opacity-30">
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative z-10">
          <Link 
            href="/" 
            className="bg-clip-text bg-gradient-to-br from-white via-30% via-white to-white/30 font-bold text-2xl text-center leading-[1.2] md:leading-[1.3] text-transparent"
          >
            ImpactArc
          </Link>
        </div>
      </div>
    </nav>
  )
} 