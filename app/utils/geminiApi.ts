import { GoogleGenerativeAI } from '@google/generative-ai';

// Define interfaces for the analysis response
export interface InfluencerAnalysis {
  'Influencer Name': string;
  'Social Media Handles': {
    Instagram: string;
    Twitter: string;
    YouTube: string;
    Other: string;
  };
  'Engagement Analysis': {
    Rating: string;
    Justification: string;
    RedFlags: string[];
  };
  'Influence Quality': {
    Rating: string;
    Justification: string;
    RedFlags: string[];
  };
  'Account Maturity': {
    Rating: string;
    Justification: string;
    RedFlags: string[];
  };
  'Overall Assessment': {
    CredibilityScore: string;
    Recommendation: string;
    Strengths: string[];
    Concerns: string[];
  };
}

// Function to analyze influencer data using Google's Gemini API
export async function analyzeInfluencerData(
  apiKey: string,
  influencerName: string,
  reelsData: any[]
): Promise<InfluencerAnalysis | null> {
  try {
    if (!apiKey) {
      console.error('Gemini API key is not provided');
      return null;
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Prepare the reels data summary
    const totalReels = reelsData.length;
    
    // Format the prompt with the influencer data
    const prompt = `
    Analyze the following influencer metrics and provide a detailed credibility assessment for ${influencerName} based on the extracted Instagram reels data.
    
    ### **Reels Data Summary:**
    - Total Reels Analyzed: ${totalReels}
    - Recent Reels Details: ${JSON.stringify(reelsData, null, 2)}
    
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

    // Generate content using the Gemini API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    try {
      // Find JSON in the response (in case there's text before or after)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]) as InfluencerAnalysis;
        return analysisData;
      } else {
        console.error('Could not find valid JSON in the API response');
        return null;
      }
    } catch (error) {
      console.error('Error parsing Gemini API response:', error);
      return null;
    }
  } catch (error) {
    console.error('Error analyzing influencer data:', error);
    return null;
  }
}
