'use client';

import { useState, useEffect } from 'react';
import { Loader2, BarChart3 } from 'lucide-react';
import { analyzeInfluencer, AnalysisResult } from '../utils/geminiApi';

interface InfluencerAnalysisProps {
  username: string;
  filename?: string;
}

export default function InfluencerAnalysis({ username, filename }: InfluencerAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reelsData, setReelsData] = useState<any>(null);

  // Fetch the reels data automatically when component mounts
  useEffect(() => {
    if (username && filename) {
      fetchReelsData();
    }
  }, [username, filename]);

  const fetchReelsData = async () => {
    try {
      // Use the provided filename or fallback to the default pattern
      const actualFilename = filename || `${username}_instagram_reels.json`;
      console.log('Attempting to fetch reels data from:', `/temp/${actualFilename}`);
      
      const reelsDataResponse = await fetch(`/temp/${actualFilename}`);
      
      if (!reelsDataResponse.ok) {
        console.error('Failed to fetch reels data:', reelsDataResponse.status, reelsDataResponse.statusText);
        throw new Error(`Failed to fetch reels data: ${reelsDataResponse.status} ${reelsDataResponse.statusText}`);
      }
      
      const data = await reelsDataResponse.json();
      console.log('Successfully fetched reels data:', data);
      setReelsData(data);
      return data;
    } catch (err) {
      console.error('Error fetching reels data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Instagram data');
      return null;
    }
  };

  const analyzeMeta = async () => {
    if (!username) return;

    try {
      setLoading(true);
      setError(null);
      
      // Get reels data if not already fetched
      let data = reelsData;
      if (!data) {
        data = await fetchReelsData();
      }
      
      if (!data) {
        throw new Error('Failed to fetch reels data. Please make sure you have scraped the data first.');
      }
      
      // Now call the Gemini API directly
      console.log('Calling Gemini API with reels data:', data);
      const analysisResult = await analyzeInfluencer(username, data);
      console.log('Received analysis result:', analysisResult);
      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract rating number from string like "8/10"
  const extractRating = (ratingStr: string): number => {
    const match = ratingStr.match(/(\d+)\/10/);
    return match ? parseInt(match[1], 10) : 0;
  };

  return (
    <div className="mt-6">
      {!result && !loading && (
        <div className="text-center">
          <button
            onClick={analyzeMeta}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center mx-auto"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Analyze with Gemini AI
          </button>
          {error && (
            <p className="mt-2 text-red-500 text-sm">{error}</p>
          )}
          {reelsData && (
            <p className="mt-2 text-green-500 text-sm">Reels data loaded successfully. Click to analyze.</p>
          )}
        </div>
      )}
      
      {loading && (
        <div className="text-center py-8 space-y-2">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          </div>
          <p className="text-gray-700 font-medium">Analyzing @{username} with Gemini AI...</p>
          <p className="text-sm text-gray-500">This might take a minute</p>
        </div>
      )}
      
      {result && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
            <h2 className="text-2xl font-bold">{result["Influencer Name"]}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(result["Social Media Handles"]).map(([platform, link]) => (
                link !== "link_here" && (
                  <a 
                    key={platform}
                    href={link.startsWith('http') ? link : `https://${link}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-white/20 px-2 py-1 rounded-full text-white hover:bg-white/30"
                  >
                    {platform}
                  </a>
                )
              ))}
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Engagement Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                Engagement Analysis
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                  {result["Engagement Analysis"].Rating}
                </span>
              </h3>
              <div className="mt-2 mb-4 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${extractRating(result["Engagement Analysis"].Rating) * 10}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm">
                {result["Engagement Analysis"].Justification}
              </p>
              {result["Engagement Analysis"].RedFlags && result["Engagement Analysis"].RedFlags.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-red-700">Red Flags:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 pl-2">
                    {result["Engagement Analysis"].RedFlags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Influence Quality */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                Influence Quality
                <span className="ml-2 text-sm bg-purple-100 text-purple-800 py-1 px-2 rounded-full">
                  {result["Influence Quality"].Rating}
                </span>
              </h3>
              <div className="mt-2 mb-4 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${extractRating(result["Influence Quality"].Rating) * 10}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm">
                {result["Influence Quality"].Justification}
              </p>
              {result["Influence Quality"].RedFlags && result["Influence Quality"].RedFlags.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-red-700">Red Flags:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 pl-2">
                    {result["Influence Quality"].RedFlags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Account Maturity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                Account Maturity
                <span className="ml-2 text-sm bg-green-100 text-green-800 py-1 px-2 rounded-full">
                  {result["Account Maturity"].Rating}
                </span>
              </h3>
              <div className="mt-2 mb-4 bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${extractRating(result["Account Maturity"].Rating) * 10}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm">
                {result["Account Maturity"].Justification}
              </p>
              {result["Account Maturity"].RedFlags && result["Account Maturity"].RedFlags.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-red-700">Red Flags:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 pl-2">
                    {result["Account Maturity"].RedFlags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Overall Assessment */}
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                Overall Assessment
                <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">
                  {result["Overall Assessment"].CredibilityScore}
                </span>
              </h3>
              
              <p className="text-gray-700 text-sm mt-2 font-medium">
                {result["Overall Assessment"].Recommendation}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs font-medium text-green-700">Key Strengths:</p>
                  <ul className="list-disc list-inside text-xs text-green-600 pl-2">
                    {result["Overall Assessment"].Strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-red-700">Key Concerns:</p>
                  <ul className="list-disc list-inside text-xs text-red-600 pl-2">
                    {result["Overall Assessment"].Concerns.map((concern, index) => (
                      <li key={index}>{concern}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 text-xs text-center text-gray-500">
            Analysis powered by Google's Gemini 1.5 Pro AI
          </div>
        </div>
      )}
    </div>
  );
} 