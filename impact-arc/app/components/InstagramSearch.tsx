"use client";

import { useState, useEffect } from "react";
import InfluencerAnalysis from "./InfluencerAnalysis";
import {
  analyzeInfluencerData,
  InfluencerAnalysis as AnalysisData,
} from "../../utils/geminiApi";
import { Waves } from "../../components/ui/waves-background";

interface SearchResult {
  success: boolean;
  message: string;
  filename?: string;
  results?: any[];
  error?: string;
}

export default function InstagramSearch() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter an Instagram username");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setAnalysis(null);

    try {
      const response = await fetch(
        `/api/scrape?username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      setResult(data);

      if (!data.success) {
        setError(data.message || "Failed to scrape Instagram data");
      } else if (data.results && data.results.length > 0) {
        // Auto start the analysis if data was scraped successfully
        await handleAnalyze(data.results);
      }
    } catch (err) {
      setError(
        "An error occurred while processing your request. Please try again."
      );
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (resultsData?: any[]) => {
    if ((!result?.results && !resultsData) || !apiKey) {
      setError("Unable to analyze the data. The API key may be missing.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const dataToAnalyze = resultsData || result?.results || [];
      const analysisResult = await analyzeInfluencerData(
        apiKey,
        username,
        dataToAnalyze,
        []
      );

      if (analysisResult) {
        setAnalysis(analysisResult);
      } else {
        setError(
          "Failed to analyze the data. The analysis service may be temporarily unavailable."
        );
      }
    } catch (err) {
      setError("An error occurred during analysis. Please try again later.");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black">
      <Waves className="opacity-10" />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instagram Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  @
                </span>
                <input
                  type="text"
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-gray-900 focus:ring-gray-500 focus:border-gray-500"
                  disabled={isLoading || isAnalyzing}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isAnalyzing}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading || isAnalyzing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Scraping Instagram...
                </span>
              ) : isAnalyzing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing Profile...
                </span>
              ) : (
                "Scrape & Analyze Instagram Profile"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && result.success && !isAnalyzing && !analysis && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{result.message}</p>
                  <p className="text-sm text-green-600 mt-2">
                    {result.results &&
                      `Found ${result.results.length} reels from @${username}`}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Analyzing profile data...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Display analysis results if available */}
        {analysis && <InfluencerAnalysis data={analysis} />}
      </div>
    </div>
  );
}
