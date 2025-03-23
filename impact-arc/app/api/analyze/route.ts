// app/api/analyze-influencer/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Interfaces for the input data (from the Instagram scraper)
interface ReelData {
  url: string;
  thumbnail: string | null;
  videoUrl: string | null;
  caption: string;
  likeCount: string;
  postDate: string;
  comments: { username: string; text: string; likes: string }[];
}

interface UserInfo {
  username: string;
  name: string;
  bioText: string;
  profileImage: string;
  followers?: string;
  following?: string;
  posts?: string;
  links: string[];
}

interface ScrapeResult {
  userInfo: UserInfo;
  reels: ReelData[];
}

// Interface for the expected JSON output
interface AnalysisResult {
  profileInfo: {
    username: string;
    name: string;
    profilePic: string;
    bio: string;
    completeness: { score: string; percentage: string };
  };
  ratings: {
    profile: {
      score: string;
      bio: string;
      imageQuality: string;
      linkCredibility: string;
    };
    engagement: { score: string; percentage: string; dailyTrend: string };
    content: { score: string; consistency: string; categoryAlignment: string };
    authenticity: { score: string; riskPercentage: string };
    publicPerception: { score: string; sources: string[]; mentions: string[] };
    brandSuitability: {
      score: string;
      alignment: string;
      pastCollaborations: string[];
    };
  };
  categoryClassification: {
    primary: { name: string; percentage: string };
    secondary: { name: string; percentage: string }[];
  };
  audienceDemographics: {
    ageGroups: {
      "13-17": string;
      "18-24": string;
      "25-34": string;
      "35+": string;
    };
    genderDistribution: { male: string; female: string; other: string };
    topLocations: { country: string; percentage: string }[];
  };
  reelsAnalysis: {
    thumbnail: string;
    caption: string;
    engagement: {
      rawLikes: number;
      rawComments: number;
      ratePercentage: string;
      score: string;
    };
    timing: { postDate: string; peakHour: string };
  }[];
  visualizationData: {
    engagementTrend: { dates: string[]; rates: string[] };
    performanceMatrix: {
      bestPost: { engagementRate: string; score: string };
      worstPost: { engagementRate: string; score: string };
    };
  };
  riskFactors: {
    redFlags: string[];
    anomalies: string[];
    controversies: string[];
  };
  overallAssessment: {
    credibilityScore: string;
    brandSuitabilityScore: string;
    recommendation: string;
    strengths: string[];
    concerns: string[];
  };
}

// System prompt template
const systemPrompt = (fullData: ScrapeResult) => `
Analyze the Instagram influencer's profile, engagement metrics, audience insights, and public reputation to generate a detailed brand suitability assessment. The analysis should help brand managers determine whether this influencer is a *good fit for collaborations or sponsorships. Additionally, **search the web* for external credibility factors, such as news articles, rankings, past brand deals, and controversies.

### Step 1: Profile & Web Data Collection
- Extract Instagram profile details:
  - Username: ${fullData.userInfo.username}
  - Name: ${fullData.userInfo.name}
  - Bio: ${fullData.userInfo.bioText}
  - Profile Picture: ${fullData.userInfo.profileImage}
  - Links: ${JSON.stringify(fullData.userInfo.links)}

- Perform a web search for:
  - Influencer's niche/category (e.g., Fitness, Travel, Fashion, Tech, etc.).
  - Any news articles, interviews, brand collaborations, past sponsorships, or controversies.
  - Their reputation and trustworthiness within their niche.

### Step 2: Engagement, Content & Audience Analysis
- Total Reels Analyzed: ${fullData.reels.length}
- Recent Reels Data: ${JSON.stringify(fullData.reels, null, 2)}
- Calculate engagement rate (%) and likes-to-comments ratio.
- Analyze comment patterns (spam detection, authenticity, audience sentiment).
- Evaluate caption effectiveness, storytelling, and post frequency.
- Check content consistency and branding alignment.

### Step 3: Audience Demographics & Brand Fit
- Detect primary audience segment:
  - Age group breakdown (13-17, 18-24, 25-34, 35+).
  - Gender distribution (Male/Female/Other %).
  - Geographic location breakdown (Top 3 countries).
- Brand Suitability Score (1-10):
  - How well does the influencer’s content align with brand values?
  - Have they worked with similar brands before?
  - Any negative PR or brand controversies?
  - Audience sentiment analysis (positive/neutral/negative trends).

### Step 4: Influencer Ratings (Scale 1-10)
#### 1. Profile Rating
- Bio completeness, profile image quality, and link credibility.
#### 2. Engagement Rating
- Average engagement rate percentage.
- Daily/weekly engagement trends.
#### 3. Content Quality Rating
- Caption effectiveness, visual consistency, and category alignment.
- Posting frequency consistency.
#### 4. Authenticity Rating
- Fake engagement detection, comment authenticity, and growth trends.
#### 5. Public Perception & Brand Collaboration History
- Past brand deals and sponsorships.
- External media coverage and reputation.
- Audience response to previous promotions.
- Social media presence beyond Instagram.

### Step 5: Risk Analysis & Red Flags
- Check for suspicious follower growth trends.
- Identify high % of bot/spam comments.
- Detect potential controversies or negative PR.
- Assess influencer's response to criticism.

### Step 6: Required JSON Output
Return only JSON-formatted response in the following format:

\\\`json
{
  "profileInfo": {
    "username": "${fullData.userInfo.username}",
    "name": "${fullData.userInfo.name}",
    "profilePic": "${fullData.userInfo.profileImage}",
    "bio": "${fullData.userInfo.bioText}",
    "completeness": { "score": "X/10", "percentage": "XX%" }
  },
  "ratings": {
    "profile": { "score": "X/10", "bio": "X/10", "imageQuality": "X/10", "linkCredibility": "X/10" },
    "engagement": { "score": "X/10", "percentage": "XX%", "dailyTrend": "±XX%" },
    "content": { "score": "X/10", "consistency": "XX%", "categoryAlignment": "XX%" },
    "authenticity": { "score": "X/10", "riskPercentage": "XX%" },
    "publicPerception": { "score": "X/10", "sources": ["source1", "source2"], "mentions": ["mention1", "mention2"] },
    "brandSuitability": { "score": "X/10", "alignment": "XX%", "pastCollaborations": ["brand1", "brand2"] }
  },
  "categoryClassification": {
    "primary": { "name": "category", "percentage": "XX%" },
    "secondary": [ { "name": "category1", "percentage": "XX%" }, { "name": "category2", "percentage": "XX%" } ]
  },
  "audienceDemographics": {
    "ageGroups": { "13-17": "XX%", "18-24": "XX%", "25-34": "XX%", "35+": "XX%" },
    "genderDistribution": { "male": "XX%", "female": "XX%", "other": "XX%" },
    "topLocations": [ { "country": "Country1", "percentage": "XX%" }, { "country": "Country2", "percentage": "XX%" } ]
  },
  "reelsAnalysis": [
    {
      "thumbnail": "url",
      "caption": "text",
      "engagement": { "rawLikes": number, "rawComments": number, "ratePercentage": "XX%", "score": "X/10" },
      "timing": { "postDate": "YYYY-MM-DD", "peakHour": "HH:MM" }
    }
  ],
  "visualizationData": {
    "engagementTrend": { "dates": ["YYYY-MM-DD"], "rates": ["XX%"] },
    "performanceMatrix": {
      "bestPost": { "engagementRate": "XX%", "score": "X/10" },
      "worstPost": { "engagementRate": "XX%", "score": "X/10" }
    }
  },
  "riskFactors": {
    "redFlags": ["flag1", "flag2"],
    "anomalies": ["anomaly1", "anomaly2"],
    "controversies": ["controversy1", "controversy2"]
  },
  "overallAssessment": {
    "credibilityScore": "X/10",
    "brandSuitabilityScore": "X/10",
    "recommendation": "final recommendation(do the deep web search about the influencer and give the recommendation)",
    "strengths": ["strength1", "strength2"],
    "concerns": ["concern1", "concern2"]
  }
}
\\\`
`;

// API Route Handler
export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const fullData: ScrapeResult = requestBody.data;
    console.log("Received data:", fullData);

    if (!fullData) {
      console.log("Validation failed: fullData:", fullData);
      return NextResponse.json(
        { error: "Invalid or missing Instagram data" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
    }); // Adjust model as needed
    const prompt = systemPrompt(fullData);

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // Parse the response as JSON (assuming Gemini returns it in the correct format)
    console.log("Raw Gemini response:", responseText);

    // Clean the response by removing Markdown code fences
    let cleanedResponse = responseText
      .replace(/json/g, "") // Remove opening json
      .replace(/```/g, "")
      .trim(); // Remove leading/trailing whitespace

    let analysisResult: AnalysisResult;
    try {
      analysisResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      return NextResponse.json(
        { error: "Invalid response format from Gemini" },
        { status: 500 }
      );
    }

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze influencer data" },
      { status: 500 }
    );
  }
}
