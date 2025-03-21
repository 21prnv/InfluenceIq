import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with a fixed API key
const genAI = new GoogleGenerativeAI('AIzaSyA-xsH1XeeMzRgxo1tn3rUX03diW4CCLgA');

export interface AnalysisResult {
  "Influencer Name": string;
  "Social Media Handles": {
    Instagram: string;
    Twitter: string;
    YouTube: string;
    Other: string;
  };
  "Engagement Analysis": {
    Rating: string;
    Justification: string;
    RedFlags: string[];
  };
  "Influence Quality": {
    Rating: string;
    Justification: string;
    RedFlags: string[];
  };
  "Account Maturity": {
    Rating: string;
    Justification: string;
    RedFlags: string[];
  };
  "Overall Assessment": {
    CredibilityScore: string;
    Recommendation: string;
    Strengths: string[];
    Concerns: string[];
  }
}

// Function to analyze an influencer with Gemini API
export async function analyzeInfluencer(influencerName: string, reelsData: any): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // Process the reels data to extract the most important information
  let processedData = reelsData;
  
  // If the data has a results property (from the scraper), use that
  if (reelsData && typeof reelsData === 'object' && !Array.isArray(reelsData) && 'results' in reelsData) {
    processedData = reelsData.results;
  }
  
  // If the data is already an array, use it directly
  if (Array.isArray(reelsData)) {
    processedData = reelsData;
  }
  
  // Get basic metrics from the processed reels data
  const totalReels = Array.isArray(processedData) ? processedData.length : 0;
  const recentReels = Array.isArray(processedData) ? processedData.slice(0, 5) : [];
  
  console.log('Processing reels data for analysis:', {
    totalReels,
    sampleReel: recentReels.length > 0 ? recentReels[0] : 'No reels found'
  });
  
  const prompt = `
  Analyze the following influencer metrics and provide a detailed credibility assessment for ${influencerName} based on the extracted Instagram reels data.
  
  ### **Reels Data Summary:**
  - Total Reels Analyzed: ${totalReels}
  - Recent Reels Details: ${JSON.stringify(recentReels, null, 2)}
  
  ### **1. Engagement Analysis (Rate 1-10):**  
  - Calculate average engagement rate based on likes and comments.
  - Analyze comment patterns and quality of engagement.
  - Evaluate consistency in engagement across different reels.
  - Look for suspicious patterns in comments or engagement.
  - Consider the authenticity of engagement based on content type.
  
  ### **2. Influence Quality (Rate 1-10):**  
  - Assess content quality and originality.
  - Evaluate the diversity and depth of content.
  - Analyze caption quality and storytelling.
  - Measure consistency of branding and messaging.
  - Consider the potential impact on the target audience.
  
  ### **3. Account Maturity (Rate 1-10):**  
  - Estimate account age based on content patterns.
  - Evaluate content evolution and growth.
  - Assess professional presentation and production quality.
  - Analyze content scheduling and posting frequency.
  - Consider the development of the creator's voice and style.
  
  ### **For each category, provide:**  
  - Numerical rating (1-10).  
  - Brief justification based on objective metrics.  
  - Red flags (if any).  
  
  ### **Conclude with:**  
  - Overall credibility score (average of all ratings).  
  - Specific recommendation for brands considering a partnership.  
  - Key strengths identified from the content.  
  - Potential concerns or areas for improvement.  
  
  ### **Important Notes:**  
  - Base your analysis only on the data provided.
  - If certain information is missing, mark it as **"Unable to assess"** rather than making predictions.
  - Focus on objective metrics rather than subjective judgments when possible.
  - Return only a **well-structured JSON response** with the following format:
  {
    "Influencer Name": "${influencerName}",
    "Social Media Handles": {
      "Instagram": "@${influencerName}",
      "Twitter": "N/A",
      "YouTube": "N/A",
      "Other": "N/A"
    },
    "Engagement Analysis": {
      "Rating": "X/10",
      "Justification": "brief explanation",
      "RedFlags": ["flag1", "flag2"]
    },
    "Influence Quality": {
      "Rating": "X/10",
      "Justification": "brief explanation",
      "RedFlags": ["flag1", "flag2"]
    },
    "Account Maturity": {
      "Rating": "X/10",
      "Justification": "brief explanation",
      "RedFlags": ["flag1", "flag2"]
    },
    "Overall Assessment": {
      "CredibilityScore": "X/10",
      "Recommendation": "final recommendation",
      "Strengths": ["strength1", "strength2"],
      "Concerns": ["concern1", "concern2"]
    }
  }
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from potential markdown code blocks
    let jsonContent = responseText;
    
    // Check if the response contains markdown code blocks
    const jsonBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      // Extract the content within the code block
      jsonContent = jsonBlockMatch[1].trim();
    } else {
      // If no code blocks, try to find JSON-like content (starting with '{' and ending with '}')
      const jsonMatch = responseText.match(/{[\s\S]*}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
    }
    
    console.log("Extracted JSON content:", jsonContent);
    
    // Parse the JSON content
    try {
      return JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Error parsing Gemini response as JSON:", parseError);
      throw new Error('Failed to parse AI analysis response');
    }
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
} 