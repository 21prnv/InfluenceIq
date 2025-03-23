"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Star, Zap, Shield, Users, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve the analysis data from sessionStorage
    const storedAnalysis = sessionStorage.getItem('profileAnalysis');
    
    if (storedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(storedAnalysis);
        setAnalysis(parsedAnalysis);
      } catch (error) {
        console.error("Error parsing analysis data:", error);
      }
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-t-purple-500 border-opacity-50 rounded-full mx-auto mb-4"></div>
          <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-gray-900 rounded-lg">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">No Analysis Found</h1>
          <p className="mb-6">We couldn't find any analysis data. Please try analyzing a profile again.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Profile Analysis Results
          </h1>
          {analysis.profileInfo && (
            <div className="flex items-center">
              {analysis.profileInfo.profilePic && (
                <img
                  src={analysis.profileInfo.profilePic}
                  alt={analysis.profileInfo.name || "Profile"}
                  className="h-16 w-16 rounded-full mr-4 border-2 border-purple-500"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {analysis.profileInfo.name || "Unknown"}
                </h2>
                <p className="text-gray-400">@{analysis.profileInfo.username || "username"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Overall Score Card */}
          {analysis.overallAssessment && (
            <motion.div 
              className="bg-gradient-to-br from-purple-900/50 to-purple-700/30 p-6 rounded-xl border border-purple-500/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-400" />
                Overall Assessment
              </h3>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>Brand Suitability</span>
                  <span className="font-semibold">{analysis.overallAssessment.brandSuitabilityScore}/10</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                    style={{width: `${(parseFloat(analysis.overallAssessment.brandSuitabilityScore) / 10) * 100}%`}}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>Credibility</span>
                  <span className="font-semibold">{analysis.overallAssessment.credibilityScore}/10</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" 
                    style={{width: `${(parseFloat(analysis.overallAssessment.credibilityScore) / 10) * 100}%`}}
                  ></div>
                </div>
              </div>
              {analysis.overallAssessment.recommendation && (
                <p className="text-sm text-gray-300 mt-4">{analysis.overallAssessment.recommendation}</p>
              )}
            </motion.div>
          )}

          {/* Category Classification Card */}
          {analysis.categoryClassification && (
            <motion.div 
              className="bg-gradient-to-br from-blue-900/50 to-blue-700/30 p-6 rounded-xl border border-blue-500/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-blue-400" />
                Category Classification
              </h3>
              {analysis.categoryClassification.primary && (
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>Primary: {analysis.categoryClassification.primary.name}</span>
                    <span className="font-semibold">{analysis.categoryClassification.primary.percentage}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" 
                      style={{width: analysis.categoryClassification.primary.percentage}}
                    ></div>
                  </div>
                </div>
              )}
              {analysis.categoryClassification.secondary && analysis.categoryClassification.secondary.map((category: any, index: number) => (
                <div className="mb-2" key={index}>
                  <div className="flex justify-between mb-1">
                    <span>• {category.name}</span>
                    <span className="font-semibold">{category.percentage}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-400 h-1 rounded-full" 
                      style={{width: category.percentage}}
                    ></div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Audience Demographics Card */}
          {analysis.audienceDemographics && (
            <motion.div 
              className="bg-gradient-to-br from-green-900/50 to-green-700/30 p-6 rounded-xl border border-green-500/30 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-green-400" />
                Audience Demographics
              </h3>
              {analysis.audienceDemographics.genderDistribution && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Gender Distribution</h4>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    {analysis.audienceDemographics.genderDistribution.male && (
                      <div 
                        className="bg-blue-500" 
                        style={{width: analysis.audienceDemographics.genderDistribution.male}}
                        title={`Male: ${analysis.audienceDemographics.genderDistribution.male}`}
                      ></div>
                    )}
                    {analysis.audienceDemographics.genderDistribution.female && (
                      <div 
                        className="bg-pink-500" 
                        style={{width: analysis.audienceDemographics.genderDistribution.female}}
                        title={`Female: ${analysis.audienceDemographics.genderDistribution.female}`}
                      ></div>
                    )}
                    {analysis.audienceDemographics.genderDistribution.other && (
                      <div 
                        className="bg-purple-500" 
                        style={{width: analysis.audienceDemographics.genderDistribution.other}}
                        title={`Other: ${analysis.audienceDemographics.genderDistribution.other}`}
                      ></div>
                    )}
                  </div>
                </div>
              )}
              {analysis.audienceDemographics.ageGroups && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Age Distribution</h4>
                  {Object.entries(analysis.audienceDemographics.ageGroups).map(([age, percentage]: [string, any]) => (
                    <div className="mb-1" key={age}>
                      <div className="flex justify-between text-xs">
                        <span>{age}</span>
                        <span>{percentage}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full" 
                          style={{width: percentage}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {analysis.audienceDemographics.topLocations && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Locations</h4>
                  <ul className="text-sm">
                    {analysis.audienceDemographics.topLocations.map((location: any, index: number) => (
                      <li key={index} className="flex justify-between mb-1">
                        <span>{location.country}</span>
                        <span>{location.percentage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Risk Factors Section */}
        {analysis.riskFactors && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-400" />
              Risk Analysis
            </h2>
            <div className="bg-gradient-to-br from-red-900/30 to-red-700/20 p-6 rounded-xl border border-red-500/30">
              {analysis.riskFactors.redFlags && analysis.riskFactors.redFlags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-red-400">Red Flags</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.riskFactors.redFlags.map((flag: string, index: number) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.riskFactors.anomalies && analysis.riskFactors.anomalies.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-yellow-400">Anomalies</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.riskFactors.anomalies.map((anomaly: string, index: number) => (
                      <li key={index}>{anomaly}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.riskFactors.controversies && analysis.riskFactors.controversies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-orange-400">Controversies</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.riskFactors.controversies.map((controversy: string, index: number) => (
                      <li key={index}>{controversy}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(!analysis.riskFactors.redFlags || analysis.riskFactors.redFlags.length === 0) && 
               (!analysis.riskFactors.anomalies || analysis.riskFactors.anomalies.length === 0) && 
               (!analysis.riskFactors.controversies || analysis.riskFactors.controversies.length === 0) && (
                <p className="text-green-400">No significant risk factors were identified for this profile.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Ratings Section */}
        {analysis.ratings && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-4">Detailed Ratings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysis.ratings).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  {typeof value === 'object' ? (
                    <div>
                      {Object.entries(value).map(([subKey, subValue]: [string, any]) => (
                        <div key={subKey} className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400 capitalize">{subKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span>{subValue}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{value}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Strengths and Concerns */}
        {analysis.overallAssessment && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {analysis.overallAssessment.strengths && analysis.overallAssessment.strengths.length > 0 && (
              <div className="bg-gradient-to-br from-green-900/30 to-green-700/20 p-6 rounded-xl border border-green-500/30">
                <h3 className="text-lg font-semibold mb-4 text-green-400">Strengths</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {analysis.overallAssessment.strengths.map((strength: string, index: number) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.overallAssessment.concerns && analysis.overallAssessment.concerns.length > 0 && (
              <div className="bg-gradient-to-br from-orange-900/30 to-orange-700/20 p-6 rounded-xl border border-orange-500/30">
                <h3 className="text-lg font-semibold mb-4 text-orange-400">Concerns</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {analysis.overallAssessment.concerns.map((concern: string, index: number) => (
                    <li key={index}>{concern}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        <div className="text-center mt-12 border-t border-gray-800 pt-8">
          <Link 
            href="/" 
            className="px-6 py-3 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Analyze Another Profile
          </Link>
        </div>
      </div>
    </div>
  );
} 