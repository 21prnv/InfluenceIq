interface InstagramSearchProps {
  onSubmit?: (username: string) => void;
}

export function InstagramAnalyzer({ onSubmit }: InstagramSearchProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl text-black font-bold mb-4">
          Instagram Reels Analyzer
        </h1>
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1 w-24"></div>
        </div>
        <p className="text-center mb-4 text-gray-600 max-w-2xl mx-auto">
          Enter an Instagram username below to scrape their reels and analyze the profile.
        </p>
        <p className="text-center mb-8 text-gray-500 max-w-2xl mx-auto text-sm italic">
          Powered by Google&apos;s Gemini 1.5 Pro AI for in-depth influencer analysis
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter Instagram username"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button 
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Analyze Profile
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Results will appear here after analysis. Our AI will evaluate:
          </p>
          <ul className="mt-2 space-y-2">
            <li className="flex items-center text-sm text-gray-600">
              <span className="mr-2">📊</span> Engagement metrics and trends
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="mr-2">🎯</span> Content performance analysis
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="mr-2">👥</span> Audience insights
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <span className="mr-2">📈</span> Growth potential score
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 