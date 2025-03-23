'use client'

import { StarBorder } from "./star-border"

interface InstagramSearchProps {
  onSubmit?: (username: string) => void;
}

export function InstagramAnalyzer({ onSubmit }: InstagramSearchProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="bg-clip-text bg-gradient-to-br from-white via-30% via-white to-white/30 font-medium text-[40px] text-transparent md:text-[72px] text-center leading-[1.2] md:leading-[1.3] mb-6">
          Instagram Reels Analyzer
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-3">
          Enter an Instagram username below to scrape their reels and analyze the profile.
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm italic">
          Powered by Google&apos;s Gemini 1.5 Pro AI for in-depth influencer analysis
        </p>
      </div>
      
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter Instagram username"
            className="flex-1 px-4 py-3 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
          />
          <StarBorder
            as="div"
            className="md:w-auto w-full"
            color="hsl(var(--primary))"
          >
            <button className="w-full px-6 py-3 font-medium">
              Analyze Profile
            </button>
          </StarBorder>
        </div>
        
        <div className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800">
          <p className="text-gray-300 mb-4">
            Results will appear here after analysis. Our AI will evaluate:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-400">
              <span className="mr-3 text-lg">📊</span> Engagement metrics and trends
            </li>
            <li className="flex items-center text-gray-400">
              <span className="mr-3 text-lg">🎯</span> Content performance analysis
            </li>
            <li className="flex items-center text-gray-400">
              <span className="mr-3 text-lg">👥</span> Audience insights
            </li>
            <li className="flex items-center text-gray-400">
              <span className="mr-3 text-lg">📈</span> Growth potential score
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 