import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingStatesProps {
  username: string;
  currentStep: "scraping" | "analyzing" | "generating";
}

export function LoadingStates({ username, currentStep }: LoadingStatesProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const increment = Math.random() * 15;
        return Math.min(prev + increment, currentStep === "generating" ? 100 : 90);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep]);

  useEffect(() => {
    switch (currentStep) {
      case "scraping":
        setLoadingText("Fetching profile data and recent posts...");
        break;
      case "analyzing":
        setLoadingText("Analyzing engagement patterns and metrics...");
        break;
      case "generating":
        setLoadingText("Generating comprehensive insights...");
        break;
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto w-full">
      <div className="w-full space-y-8">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <h2 className="text-2xl font-semibold">Analyzing @{username}</h2>
          <p className="text-muted-foreground">{loadingText}</p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className={`h-2 w-2 rounded-full ${currentStep === "scraping" ? "bg-primary animate-pulse" : progress >= 33 ? "bg-primary" : "bg-muted"}`} />
            <span className={`text-sm ${currentStep === "scraping" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Scraping Profile Data
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`h-2 w-2 rounded-full ${currentStep === "analyzing" ? "bg-primary animate-pulse" : progress >= 66 ? "bg-primary" : "bg-muted"}`} />
            <span className={`text-sm ${currentStep === "analyzing" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Analyzing Metrics
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`h-2 w-2 rounded-full ${currentStep === "generating" ? "bg-primary animate-pulse" : progress === 100 ? "bg-primary" : "bg-muted"}`} />
            <span className={`text-sm ${currentStep === "generating" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Generating Insights
            </span>
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          This process may take up to 2 minutes
        </p>
      </div>
    </div>
  );
} 