"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DonutChart, AreaChart } from "./component/charts";
import {
  ProfileOverview,
  EngagementMetrics,
  AudienceDemographics,
  ContentAnalysis,
  ReelsPerformance,
  RiskAssessment,
} from "./component/dashboard-sections";
import { DashboardHeader } from "./component/dashboard-header";
import { DashboardShell } from "./component/dashboard-shell";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LoadingStates } from "./component/loading-states";

// Create a separate component that uses useSearchParams
function DashboardContent() {
  const [username, setUsername] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<
    "scraping" | "analyzing" | "generating"
  >("scraping");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // This import is now safely inside a component that will be wrapped in Suspense
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
      fetchAnalysisData(usernameParam);
    } else {
      const storedAnalysis = sessionStorage.getItem("profileAnalysis");
      if (storedAnalysis) {
        try {
          const parsedAnalysis = JSON.parse(storedAnalysis);
          setAnalysisData(parsedAnalysis);
          if (
            parsedAnalysis.profileInfo &&
            parsedAnalysis.profileInfo.username
          ) {
            setUsername(parsedAnalysis.profileInfo.username);
          }
        } catch (error) {
          console.error("Error parsing analysis data:", error);
        }
      }
    }
  }, [searchParams]);

  const fetchAnalysisData = async (usernameToFetch: string) => {
    if (!usernameToFetch.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentStep("scraping");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout

      // Step 1: Call the scrape API
      const scrapeResponse = await fetch("/api/scrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameToFetch }),
        signal: controller.signal,
      });

      if (!scrapeResponse.ok) {
        throw new Error(
          `Scraping failed: ${
            scrapeResponse.status
          } - ${await scrapeResponse.text()}`
        );
      }

      const scrapeData = await scrapeResponse.json();
      setCurrentStep("analyzing");

      // Step 2: Call the analyze API with scraped data
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scrapeData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!analyzeResponse.ok) {
        throw new Error(
          `Analysis failed: ${
            analyzeResponse.status
          } - ${await analyzeResponse.text()}`
        );
      }

      setCurrentStep("generating");
      const analysisResult = await analyzeResponse.json();

      setAnalysisData(analysisResult);
      sessionStorage.setItem("profileAnalysis", JSON.stringify(analysisResult));
    } catch (err: any) {
      console.error("Error fetching analysis:", err);

      if (err.name === "AbortError") {
        setError(
          "Request timed out. Analysis is taking too long, please try again."
        );
      } else if (
        err.message.includes("fetch") ||
        err.message.includes("network")
      ) {
        setError(
          "Network error: Could not connect to the server. Please check your internet connection and try again."
        );
      } else {
        setError(
          `Error: ${
            err.message || "Unknown error occurred while fetching analysis data"
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;

    router.push(`/analysis?username=${encodeURIComponent(inputUsername)}`);
    setUsername(inputUsername);
    fetchAnalysisData(inputUsername);
  };

  if (loading) {
    return (
      <DashboardShell>
        <LoadingStates username={username} currentStep={currentStep} />
      </DashboardShell>
    );
  }

  if (!analysisData) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Influencer Analytics"
          text="Enter an Instagram username to see comprehensive analysis and insights"
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
              <Button type="submit" disabled={!inputUsername.trim()}>
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

// Loading fallback component
function SearchParamsLoading() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    </DashboardShell>
  );
}

// Main component with Suspense
export default function DashboardPage() {
  return (
    <Suspense fallback={<SearchParamsLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
