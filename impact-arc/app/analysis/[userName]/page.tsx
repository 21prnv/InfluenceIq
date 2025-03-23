"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DonutChart, AreaChart } from "../component/charts";
import {
  ProfileOverview,
  EngagementMetrics,
  AudienceDemographics,
  ContentAnalysis,
  ReelsPerformance,
  RiskAssessment,
} from "../component/dashboard-sections";
import { DashboardHeader } from "../component/dashboard-header";
import { DashboardShell } from "../component/dashboard-shell";
import { useRouter, useParams } from "next/navigation"; // Changed to useParams for dynamic route
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supbase/client";

// Initialize Supabase client

export default function DashboardPage() {
  const [username, setUsername] = useState<string>(""); // From route
  const [inputUsername, setInputUsername] = useState<string>(""); // From text field
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [scrapedData, setScrapedData] = useState<any>(null); // Store scraped data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams(); // Get dynamic route params
  const supabase = createClient();
  // Extract username from route on mount
  // Inside DashboardPage component
  useEffect(() => {
    const usernameFromRoute = params.userName as string;
    if (usernameFromRoute) {
      setUsername(decodeURIComponent(usernameFromRoute));
      checkAndFetchData(decodeURIComponent(usernameFromRoute));
    }
  }, [params.userName]);

  // Function to merge scraped data with analytics data
  const mergeReelsData = (scraped: any, analysis: any) => {
    if (!scraped?.reels || !analysis?.reelsAnalysis) return analysis;

    const updatedReelsAnalysis = analysis.reelsAnalysis.map((reel: any) => {
      const matchingReel = scraped.reels.find((scrapedReel: any) => {
        // Convert dates to a comparable format (e.g., YYYY-MM-DD)
        const scrapedDate = new Date(scrapedReel.postDate)
          .toISOString()
          .split("T")[0];
        const analysisDate = reel.timing.postDate; // Already in YYYY-MM-DD
        return scrapedDate === analysisDate;
      });

      if (matchingReel) {
        return {
          ...reel,
          url: matchingReel.url,
          thumbnail: matchingReel.thumbnail, // Override the existing thumbnail if needed
        };
      }
      return reel; // Return unchanged if no match
    });

    return {
      ...analysis,
      reelsAnalysis: updatedReelsAnalysis,
    };
  };

  // Check Supabase for existing data and fetch or prompt accordingly
  const checkAndFetchData = async (usernameToCheck: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: existingData, error: fetchError } = await supabase
        .from("user_data")
        .select("insta_username, scrapped_data, reponse")
        .eq("insta_username", usernameToCheck)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error("Error checking database: " + fetchError.message);
      }

      if (existingData) {
        setScrapedData(existingData.scrapped_data);
        const mergedData = mergeReelsData(
          existingData.scrapped_data,
          existingData.reponse
        );
        setAnalysisData(mergedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error checking data:", err);
      setError(`Error: ${err.message || "Unknown error checking data"}`);
      setLoading(false);
    }
  };

  // Handle scraping and analyzing when user submits a new username
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const scrapeResponse = await fetch("/api/scrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: inputUsername }),
      });

      if (!scrapeResponse.ok) {
        throw new Error(
          `Scraping failed: ${
            scrapeResponse.status
          } - ${await scrapeResponse.text()}`
        );
      }

      const scrapeData = await scrapeResponse.json();
      setScrapedData(scrapeData);

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: scrapeData }),
      });

      if (!analyzeResponse.ok) {
        throw new Error(
          `Analysis failed: ${
            analyzeResponse.status
          } - ${await analyzeResponse.text()}`
        );
      }

      const analysisResult = await analyzeResponse.json();
      const mergedData = mergeReelsData(scrapeData, analysisResult);
      setAnalysisData(mergedData);

      const { error: insertError } = await supabase.from("user_data").insert({
        insta_username: inputUsername,
        scrapped_data: scrapeData,
        reponse: mergedData,
      });

      if (insertError) {
        throw new Error("Failed to save data: " + insertError.message);
      }

      router.push(`/analysis/${encodeURIComponent(inputUsername)}`);
      setUsername(inputUsername);
    } catch (err: any) {
      console.error("Error processing data:", err);
      setError(`Error: ${err.message || "Unknown error occurred"}`);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-lg">Analyzing profile data for @{username}...</p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take up to 2 minutes
          </p>
        </div>
      </DashboardShell>
    );
  }

  // If no data exists and no analysis yet, show input form
  if (!analysisData && !scrapedData) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Influencer Analytics"
          text={`No data found for @${username}. Enter an Instagram username to analyze.`}
        />
        <Card>
          <CardHeader>
            <CardTitle>Analyze Instagram Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter Instagram username"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!inputUsername.trim() || loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Analyze <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-4 border border-destructive rounded-md bg-destructive/10 text-destructive">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  // Dashboard with analyzed data
  return (
    <DashboardShell>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ProfileOverview data={analysisData} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Profile Score
                </CardTitle>
                <Badge variant="outline">
                  {analysisData.ratings?.profile?.score || "7/10"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysisData.profileInfo?.completeness?.percentage || "70%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Profile completeness
                </p>
                <Progress
                  value={parseInt(
                    (
                      analysisData.profileInfo?.completeness?.percentage ||
                      "70%"
                    ).replace("%", "")
                  )}
                  className="mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Engagement Rate
                </CardTitle>
                <Badge variant="outline">
                  {analysisData.ratings?.engagement?.score || "7/10"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysisData.ratings?.engagement?.percentage || "2.8%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Daily trend:{" "}
                  {analysisData.ratings?.engagement?.dailyTrend || "±5%"}
                </p>
                <Progress
                  value={
                    parseInt(
                      (
                        analysisData.ratings?.engagement?.percentage || "2.8%"
                      ).replace("%", "")
                    ) * 10
                  }
                  className="mt-2"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Brand Suitability
                </CardTitle>
                <Badge variant="outline">
                  {analysisData.ratings?.brandSuitability?.score || "6/10"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analysisData.ratings?.brandSuitability?.alignment || "70%"}
                </div>
                <p className="text-xs text-muted-foreground">Brand alignment</p>
                <Progress
                  value={parseInt(
                    (
                      analysisData.ratings?.brandSuitability?.alignment || "70%"
                    ).replace("%", "")
                  )}
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Category Classification</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <DonutChart data={analysisData.categoryClassification} />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Engagement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={analysisData.visualizationData?.engagementTrend}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <EngagementMetrics data={analysisData} />
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <AudienceDemographics data={analysisData} />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentAnalysis data={analysisData} />
          <ReelsPerformance data={analysisData} />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <RiskAssessment data={analysisData} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
