import InstagramSearch from './components/InstagramSearch';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl text-black font-bold text-center mb-4">Instagram Reels Analyzer</h1>
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1 w-24"></div>
        </div>
        <p className="text-center mb-4 text-gray-600 max-w-2xl mx-auto">
          Enter an Instagram username below to scrape their reels and analyze the profile.
        </p>
        <p className="text-center mb-8 text-gray-500 max-w-2xl mx-auto text-sm italic">
          Powered by Google's Gemini 1.5 Pro AI for in-depth influencer analysis
        </p>
        
        <InstagramSearch />
      </div>
    </main>
  );
}
