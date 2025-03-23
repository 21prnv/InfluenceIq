"use client"

import Link from "next/link"
import { StarBorder } from "./star-border"
import { useState } from "react"
import { ChevronRight, Search } from "lucide-react"

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="relative bg-purple-900/20 ">
      <div className="absolute inset-0"></div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative z-10">
          <div className="flex items-center justify-between w-full">
            <Link 
              href="/" 
              className="flex items-center space-x-2 bg-clip-text bg-gradient-to-br from-white via-30% via-white to-white/30 font-bold text-2xl text-center leading-[1.2] md:leading-[1.3] text-transparent"
            >
              <span className="text-purple-300">⬢</span>
              <span>ImpactArc</span>
            </Link>
            
            <div className="hidden md:flex space-x-8">
              <Link 
                href="#recent"
                className="text-gray-300 hover:text-white hover:bg-purple-500/10 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
              >
                Recent Posts
              </Link>
              <Link 
                href="#top-creators"
                className="text-gray-300 hover:text-white hover:bg-purple-500/10 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
              >
                Browse Creators
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button - hidden on desktop */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-gray-300 hover:text-white"
              aria-label="Toggle mobile menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/90 backdrop-blur-md py-2 px-4 rounded-b-lg border-t border-gray-800">
            <div className="flex flex-col space-y-2 pb-3 pt-2">
              <Link 
                href="/top-creators"
                className="text-gray-300 hover:text-white hover:bg-purple-500/10 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Top Creators
              </Link>
              <Link 
                href="/browse"
                className="text-gray-300 hover:text-white hover:bg-purple-500/10 px-3 py-2 rounded-md transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Creators
              </Link>
              
            </div>
          </div>
        )}
      </div>
    </nav>
  )
 
} 