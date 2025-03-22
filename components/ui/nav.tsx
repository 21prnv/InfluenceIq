import Link from "next/link"

export function Nav() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            InfluenceIQ
          </Link>
          
          <div className="flex gap-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/analyzer" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Analyzer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 