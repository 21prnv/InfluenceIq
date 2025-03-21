'use client';

import { useState } from 'react';
import { Loader2, Download, Instagram, Search } from 'lucide-react';
import InfluencerAnalysis from './InfluencerAnalysis';

interface SearchResult {
  success: boolean;
  message: string;
  filename?: string;
  results?: any[];
  error?: string;
}

export default function InstagramSearch() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter an Instagram username');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setShowAnalysis(false);
      
      const response = await fetch('http://localhost:3001/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to scrape Instagram data');
      }
      
      // Create a full filename for use in other places
      const fullFilename = data.filename || `${username}_instagram_reels.json`;
      
      // Set the result with the explicit filename
      setResult({
        ...data,
        filename: fullFilename
      });
      
      console.log('Received data:', data);
      setShowAnalysis(true); // Set to true after successful scraping
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadJson = () => {
    if (result?.filename) {
      window.open(`/temp/${result.filename}`, '_blank');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6">
          <div className="flex items-center justify-center mb-4">
            <Instagram className="w-8 h-8 text-white mr-2" />
            <h2 className="text-2xl font-bold text-white">Instagram Reels Scraper</h2>
          </div>
          <p className="text-white/80 text-center text-sm">
            Quickly extract and download reels data from any public Instagram profile
          </p>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter Instagram username without @"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Scraping...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Scrape Reels
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-8 space-y-2">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
              </div>
              <p className="text-gray-700 font-medium">Scraping Instagram reels for @{username}...</p>
              <p className="text-sm text-gray-500">This might take a few minutes depending on the number of reels</p>
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-lg overflow-hidden border border-green-200">
              <div className="bg-green-50 p-4">
                <h3 className="font-semibold text-green-800">{result.message}</h3>
              </div>
              
              {result.filename && (
                <div className="p-4 bg-white border-t border-green-100">
                  <button
                    onClick={downloadJson}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download JSON Data
                  </button>
                </div>
              )}
              
              {result.results && result.results.length > 0 && (
                <div className="p-4 bg-white border-t border-green-100">
                  <p className="font-medium text-gray-700 mb-2">Preview of first reel:</p>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Instagram className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          <a 
                            href={result.results[0].reelUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline">
                            {result.results[0].reelUrl}
                          </a>
                        </p>
                        {result.results[0].caption && (
                          <p className="text-sm text-gray-500 mt-1">
                            {result.results[0].caption.substring(0, 100)}
                            {result.results[0].caption.length > 100 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {result.results.length} reels found in total
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Add the Gemini-powered analysis component */}
          {showAnalysis && username && (
            <>
              <div className="my-6 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-center text-gray-900 mb-4">
                  AI Analysis with Gemini
                </h3>
                <InfluencerAnalysis 
                  username={username} 
                  filename={result?.filename || `${username}_instagram_reels.json`}
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>This tool is for educational purposes only. Please respect Instagram's Terms of Service.</p>
      </div>
    </div>
  );
}