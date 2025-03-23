"use client";

import React from "react";
import { InfluencerAnalysis as AnalysisData } from "../../utils/geminiApi";
import { Waves } from "../../components/ui/waves-background";

interface InfluencerAnalysisProps {
  data: AnalysisData;
}

const InfluencerAnalysis = ({ data }: InfluencerAnalysisProps) => {
  if (!data) return null;

  // Helper function to render rating with color based on the score
  const renderRating = (rating: string) => {
    const score = parseInt(rating.split("/")[0]);
    let colorClass = "text-gray-700";

    if (score >= 8) colorClass = "text-green-600";
    else if (score >= 6) colorClass = "text-blue-600";
    else if (score >= 4) colorClass = "text-yellow-600";
    else colorClass = "text-red-600";

    return <span className={`font-bold ${colorClass}`}>{rating}</span>;
  };

  // Helper function to render red flags
  const renderRedFlags = (flags: string[]) => {
    if (
      !flags ||
      flags.length === 0 ||
      (flags.length === 1 && flags[0] === "N/A")
    ) {
      return <p className="text-green-600 text-sm">No red flags detected</p>;
    }

    return (
      <ul className="list-disc pl-5 mt-1 text-sm text-red-600">
        {flags.map((flag, index) => (
          <li key={index}>{flag}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-black">
      <Waves className="opacity-10" />
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold text-indigo-800">
            {data["Influencer Name"]} Analysis
          </h2>
          <div className="flex items-center text-gray-600 mt-1">
            <span className="mr-2">Instagram:</span>
            <span className="font-medium">
              {data["Social Media Handles"].Instagram}
            </span>
          </div>
        </div>

        {/* Analysis Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Engagement Analysis */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-indigo-800">Engagement Analysis</h3>
              <div className="bg-white px-2 py-1 rounded">
                {renderRating(data["Engagement Analysis"].Rating)}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {data["Engagement Analysis"].Justification}
            </p>
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">
                Red Flags
              </h4>
              {renderRedFlags(data["Engagement Analysis"].RedFlags)}
            </div>
          </div>

          {/* Influence Quality */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-purple-800">Influence Quality</h3>
              <div className="bg-white px-2 py-1 rounded">
                {renderRating(data["Influence Quality"].Rating)}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {data["Influence Quality"].Justification}
            </p>
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">
                Red Flags
              </h4>
              {renderRedFlags(data["Influence Quality"].RedFlags)}
            </div>
          </div>

          {/* Account Maturity */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-blue-800">Account Maturity</h3>
              <div className="bg-white px-2 py-1 rounded">
                {renderRating(data["Account Maturity"].Rating)}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {data["Account Maturity"].Justification}
            </p>
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">
                Red Flags
              </h4>
              {renderRedFlags(data["Account Maturity"].RedFlags)}
            </div>
          </div>
        </div>

        {/* Overall Assessment */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Overall Assessment
            </h3>
            <div className="bg-white px-3 py-1 rounded-full text-lg">
              {renderRating(data["Overall Assessment"].CredibilityScore)}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 mb-2">Recommendation</h4>
            <p className="text-gray-800 bg-white bg-opacity-50 p-3 rounded">
              {data["Overall Assessment"].Recommendation}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
              <ul className="list-disc pl-5 space-y-1">
                {data["Overall Assessment"].Strengths.map((strength, index) => (
                  <li key={index} className="text-gray-700">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-700 mb-2">Concerns</h4>
              <ul className="list-disc pl-5 space-y-1">
                {data["Overall Assessment"].Concerns.length > 0 ? (
                  data["Overall Assessment"].Concerns.map((concern, index) => (
                    <li key={index} className="text-gray-700">
                      {concern}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-700">
                    No major concerns identified
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerAnalysis;
