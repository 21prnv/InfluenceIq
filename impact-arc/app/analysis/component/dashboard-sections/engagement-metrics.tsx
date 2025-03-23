import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "../charts"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface EngagementMetricsProps {
  data?: any
}

export function EngagementMetrics({ data }: EngagementMetricsProps) {
  // Extract engagement data from analysis
  const ratings = data?.ratings || {}
  const engagementRating = ratings.engagement || {}
  const visualizationData = data?.visualizationData || {}
  const engagementTrend = visualizationData.engagementTrend || {}
  const performanceMatrix = visualizationData.performanceMatrix || {}
  
  // Format engagement data for the chart
  const chartData = {
    labels: engagementTrend.dates || ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Engagement Rate (%)",
        data: engagementTrend.rates || [2.8, 3.2, 2.5, 3.5, 2.9],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        tension: 0.3,
      },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
          <CardDescription>Detailed analysis of engagement and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Average Engagement</h3>
                <div className="text-2xl font-bold">{engagementRating.percentage || "2.8%"}</div>
                <p className="text-xs text-muted-foreground">Overall engagement rate</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium text-green-500">
                    {engagementRating.dailyTrend || "+5%"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">daily trend</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Best Post</h3>
                <div className="text-2xl font-bold">
                  {performanceMatrix?.bestPost?.engagementRate || "4.7%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Highest engagement rate
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium">
                    Score: {performanceMatrix?.bestPost?.score || "8/10"}
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Worst Post</h3>
                <div className="text-2xl font-bold">
                  {performanceMatrix?.worstPost?.engagementRate || "0.9%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Lowest engagement rate
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium">
                    Score: {performanceMatrix?.worstPost?.score || "3/10"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


