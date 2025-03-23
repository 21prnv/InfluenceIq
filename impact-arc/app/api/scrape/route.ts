import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';

const execPromise = promisify(exec);

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Set maximum duration to 5 minutes

// Gemini API key
const GEMINI_API_KEY = 'AIzaSyA-xsH1XeeMzRgxo1tn3rUX03diW4CCLgA';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  
  if (!username) {
    return NextResponse.json({ 
      success: false, 
      message: 'Username is required' 
    }, { status: 400 });
  }

  try {
    // Create the filename
    const filename = `${username}_data.json`;
    const outputFile = path.join(process.cwd(), 'app/api/scrape', filename);
    
    // Execute the scraper as a separate process to avoid Next.js static analysis
    const scriptPath = path.join(process.cwd(), 'app/api/scrape/scraper-runner.js');
    
    console.log(`Executing scraper for username: ${username}`);
    
    try {
      // Run the script with the username parameter
      const { stdout, stderr } = await execPromise(`node ${scriptPath} ${username}`);
      
      if (stderr) {
        console.error('Scraper stderr:', stderr);
      }
      
      console.log('Scraper stdout:', stdout);
    } catch (execError: any) {
      console.error('Error executing scraper:', execError);
      return NextResponse.json({ 
        success: false, 
        message: 'Error scraping Instagram data', 
        error: execError.message 
      }, { status: 500 });
    }
    
    // Check if file exists and process with Gemini API
    try {
      const fs = await import('fs');
      
      // Check if the file exists before trying to read it
      if (!fs.existsSync(outputFile)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Scraper did not produce output file. The profile might not exist or Instagram might be blocking the request.' 
        }, { status: 404 });
      }
      
      const data = fs.readFileSync(outputFile, 'utf8');
      let scrapedResults;
      
      try {
        scrapedResults = JSON.parse(data);
      } catch (parseError) {
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to parse scraped data', 
          error: 'The scraped data is not valid JSON' 
        }, { status: 500 });
      }
      
      // Make sure we have valid scraped results before proceeding
      if (!scrapedResults || !scrapedResults.userInfo) {
        return NextResponse.json({ 
          success: false, 
          message: 'Scraped data is invalid or incomplete' 
        }, { status: 500 });
      }
      
      // Send scraped data to Gemini API
      const geminiResponse = await processWithGemini(username, scrapedResults);
      
      if (!geminiResponse || geminiResponse.error) {
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to process data with Gemini API', 
          error: geminiResponse?.error || 'Unknown Gemini API error' 
        }, { status: 500 });
      }
      
      // Save Gemini response to a new JSON file
      const geminiFilename = `${username}_gemini_analysis.json`;
      const geminiOutputFile = path.join(process.cwd(), 'app/api/scrape', geminiFilename);
      fs.writeFileSync(geminiOutputFile, JSON.stringify(geminiResponse, null, 2));
      
      return NextResponse.json({ 
        success: true, 
        message: `Results saved to ${filename} and analysis saved to ${geminiFilename}`,
        filename,
        geminiFilename,
        results: scrapedResults,
        analysis: geminiResponse
      }, { status: 200 });
    } catch (fileError: any) {
      console.error('Error reading file or processing with Gemini:', fileError);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to read scraping results or process with Gemini', 
        error: fileError.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error scraping Instagram or processing with Gemini', 
      error: error.message 
    }, { status: 500 });
  }
}

// Function to process scraped data with Gemini API
async function processWithGemini(influencerName: string, scrapedData: any) {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-thinking-exp-01-21' });
    
    const userInfo = scrapedData.userInfo || {};
    const reelsData = scrapedData.reels || [];
    const influencerCategory = "their industry"; // Default value
    const totalReels = reelsData.length;
    
    // Format the prompt with the influencer data
    const prompt = `Analyze the given Instagram influencer's profile, engagement metrics, audience insights, and public reputation to generate a detailed brand suitability assessment. This analysis should help brand managers determine whether this influencer is a good fit for collaborations or sponsorships. Additionally, conduct a deep web search for external credibility factors such as news articles, rankings, past brand deals, and controversies to provide a comprehensive evaluation.

Step 1: Profile & Web Data Collection
Extract Instagram profile details:

Username: ${scrapedData.userInfo.username}

Name: ${scrapedData.userInfo.name}

Bio: ${scrapedData.userInfo.bioText}

Profile Picture: ${scrapedData.userInfo.profileImage}

Links: ${JSON.stringify(scrapedData.userInfo.links)}

Perform a web search to retrieve:

Influencer's niche/category (e.g., Fitness, Travel, Fashion, Tech, etc.).

Any news articles, interviews, brand collaborations, past sponsorships, or controversies.

Their reputation and trustworthiness within their niche.

Step 2: Engagement, Content & Audience Analysis
Total Reels Analyzed: ${scrapedData.reels.length}

Recent Reels Data: ${JSON.stringify(scrapedData.reels, null, 2)}

Calculate engagement rate (%) and likes-to-comments ratio.

Analyze comment patterns (spam detection, authenticity, audience sentiment).

Evaluate caption effectiveness, storytelling, and post frequency.

Check content consistency and branding alignment.

Step 3: Audience Demographics & Brand Fit
Primary audience segment detection:

Age group breakdown (13-17, 18-24, 25-34, 35+).

Gender distribution (Male/Female/Other %).

Geographic location breakdown (Top 3 countries).

Brand Suitability Score (1-10):

How well does the influencer's content align with brand values?

Have they worked with similar brands before?

Any negative PR or brand controversies?

Audience sentiment analysis (positive/neutral/negative trends).

Step 4: Influencer Ratings (Scale 1-10)
1. Profile Rating
Bio completeness, profile image quality, and link credibility.

2. Engagement Rating
Average engagement rate percentage.

Daily/weekly engagement trends.

3. Content Quality Rating
Caption effectiveness, visual consistency, and category alignment.

Posting frequency consistency.

4. Authenticity Rating
Fake engagement detection, comment authenticity, and growth trends.

5. Public Perception & Brand Collaboration History
Past brand deals and sponsorships.

External media coverage and reputation.

Audience response to previous promotions.

Social media presence beyond Instagram.

Step 5: Risk Analysis & Red Flags
Check for suspicious follower growth trends.

Identify high % of bot/spam comments.

Detect potential controversies or negative PR.

Assess influencer's response to criticism.

Step 6: Required JSON Output
Return only JSON-formatted response in the following format:

json
Copy
Edit
{
  "profileInfo": {
    "username": "${scrapedData.userInfo.username}",
    "name": "${scrapedData.userInfo.name}",
    "profilePic": "${scrapedData.userInfo.profileImage}",
    "bio": "${scrapedData.userInfo.bioText}",
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
    "recommendation": "Provide a final recommendation based on deep web research and analysis.",
    "strengths": ["strength1", "strength2"],
    "concerns": ["concern1", "concern2"]
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
        try {
          // First attempt: direct parsing
          const analysisData = JSON.parse(jsonMatch[0]);
          return analysisData;
        } catch (parseError) {
          console.log('Initial JSON parsing failed, attempting to clean the response');
          
          // Second attempt: clean the string and try again
          let cleanedJson = jsonMatch[0]
            // Remove emojis and other problematic characters
            .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
            // Replace any escaped quotes inside strings to avoid parse errors
            .replace(/\\"/g, '"')
            // Fix any unescaped quotes inside JSON strings
            .replace(/([^\\])"/g, '$1\\"')
            .replace(/"([^"]*?)([^\\])"([^"]*?)"/g, '"$1$2\\"$3"');
          
          try {
            // Attempt to parse the cleaned JSON
            return JSON.parse(cleanedJson);
          } catch (secondError) {
            console.error('Failed to parse even after cleaning:', secondError);
            
            // As a fallback, return a basic structure with the raw text
            return { 
              error: 'Could not parse response as JSON',
              rawResponse: text 
            };
          }
        }
      } else {
        console.error('Could not find valid JSON in the API response');
        return { error: 'Could not find valid JSON in the API response' };
      }
    } catch (error) {
      console.error('Error parsing Gemini API response:', error);
      return { error: 'Error parsing Gemini API response' };
    }
  } catch (error) {
    console.error('Error analyzing influencer data with Gemini:', error);
    return { error: 'Error analyzing influencer data with Gemini' };
  }
}

export async function POST(request: NextRequest) {
  // Reuse the GET handler for POST requests as well
  return GET(request);
}