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
  userInfo: any,
  reelsData: any[],
  influencerCategory: string = "their industry"
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
    Analyze the Instagram influencer's profile, engagement metrics, audience insights, and public reputation to generate a detailed brand suitability assessment. The analysis should help brand managers determine whether this influencer is a good fit for collaborations or sponsorships. Additionally, search the web for external credibility factors, such as news articles, rankings, past brand deals, and controversies.  

### Step 1: Profile & Web Data Collection  

- Extract Instagram profile details:  
  - Username: ${userInfo.username}  
  - Name: ${userInfo.name}  
  - Bio: ${userInfo.bioText}  
  - Profile Picture: ${userInfo.profileImage}  
  - Links: ${JSON.stringify(userInfo.links)}  

- Perform a web search for:  
  - Influencer's niche/category (e.g., Fitness, Travel, Fashion, Tech, etc.).  
  - Any news articles, interviews, brand collaborations, past sponsorships, or controversies.  
  - Their reputation and trustworthiness within ${influencerCategory}.  

### Step 2: Engagement, Content & Audience Analysis  
- Total Reels Analyzed: ${totalReels}  
- Recent Reels Data: ${JSON.stringify(reelsData, null, 2)}  
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
  - How well does the influencer's content align with brand values?  
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

{
  "Influencer Name": "${influencerName}",
  "Social Media Handles": {
    "Instagram": "${userInfo.username}",
    "Twitter": "",
    "YouTube": "",
    "Other": ""
  },
  "Engagement Analysis": {
    "Rating": "X/10",
    "Justification": "Detailed explanation of engagement metrics and patterns",
    "RedFlags": ["flag1", "flag2"]
  },
  "Influence Quality": {
    "Rating": "X/10",
    "Justification": "Analysis of content quality, consistency, and audience response",
    "RedFlags": ["flag1", "flag2"]
  },
  "Account Maturity": {
    "Rating": "X/10",
    "Justification": "Assessment of account age, growth patterns, and professional presentation",
    "RedFlags": ["flag1", "flag2"]
  },
  "Overall Assessment": {
    "CredibilityScore": "X/10",
    "Recommendation": "Clear recommendation on brand fit",
    "Strengths": ["strength1", "strength2"],
    "Concerns": ["concern1", "concern2"]
  }
}`;

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
