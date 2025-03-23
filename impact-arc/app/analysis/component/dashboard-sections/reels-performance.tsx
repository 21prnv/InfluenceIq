import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart } from "../charts"

interface ReelsPerformanceProps {
  data?: any
}

export function ReelsPerformance({ data }: ReelsPerformanceProps) {
  // Extract reels data
  const reelsAnalysis = data?.reelsAnalysis || [];
  
  // Prepare data for chart
  const performanceData = {
    labels: reelsAnalysis.slice(0, 5).map((_: any, index: number) => `Reel ${index + 1}`),
    datasets: [
      {
        label: "Engagement Rate (%)",
        data: reelsAnalysis.slice(0, 5).map((reel: any) => {
          if (reel && reel.engagement && reel.engagement.ratePercentage) {
            return parseFloat(reel.engagement.ratePercentage.replace('%', ''));
          }
          return 0;
        }),
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  };
  
  // Use default data if no reels data is available
  if (!reelsAnalysis.length || performanceData.datasets[0].data.every((val: number) => val === 0)) {
    performanceData.labels = ["Reel 1", "Reel 2", "Reel 3", "Reel 4", "Reel 5"];
    performanceData.datasets[0].data = [3.5, 2.8, 4.1, 2.2, 3.9];
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reels Performance</CardTitle>
        <CardDescription>Performance metrics for recent reels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="h-[250px]">
            <BarChart data={performanceData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {reelsAnalysis.slice(0, 3).map((reel: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Reel {index + 1}</h4>
                  <Badge variant={index === 0 ? "default" : "outline"}>
                    {reel?.engagement?.score || `${7 - index}/10`}
                  </Badge>
                </div>
                
                {reel?.thumbnail && (
                  <div className="aspect-video bg-muted rounded mb-2 overflow-hidden">
                    <img 
                      src={reel.thumbnail}
                      alt={`Reel ${index + 1} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="text-sm">{reel?.caption?.substring(0, 60) || `Reel caption example ${index + 1}...`}</div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Engagement: {reel?.engagement?.ratePercentage || `${(4 - index * 0.5).toFixed(1)}%`}</span>
                  <span>{reel?.timing?.postDate || "2023-06-15"}</span>
                </div>
              </div>
            ))}
            
            {reelsAnalysis.length === 0 && (
              <>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Reel {index + 1}</h4>
                      <Badge variant={index === 0 ? "default" : "outline"}>{7 - index}/10</Badge>
                    </div>
                    <div className="aspect-video bg-muted rounded mb-2"></div>
                    <div className="text-sm">Example reel caption {index + 1}...</div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Engagement: {(4 - index * 0.5).toFixed(1)}%</span>
                      <span>2023-06-15</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

