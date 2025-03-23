import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, PieChart } from "../charts"
import { Badge } from "@/components/ui/badge"

interface AudienceDemographicsProps {
  data?: any
}

export function AudienceDemographics({ data }: AudienceDemographicsProps) {
  // Extract audience demographics from data
  const demographics = data?.audienceDemographics || {}
  const ageGroups = demographics.ageGroups || {}
  const genderDistribution = demographics.genderDistribution || {}
  const topLocations = demographics.topLocations || []

  // Prepare data for charts
  const ageData = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        label: "Age Distribution",
        data: Object.values(ageGroups).map((value) => {
          const strValue = String(value);
          return parseFloat(strValue.replace('%', ''));
        }),
        backgroundColor: [
          "rgba(99, 102, 241, 0.5)",
          "rgba(99, 102, 241, 0.6)",
          "rgba(99, 102, 241, 0.7)",
          "rgba(99, 102, 241, 0.8)",
        ],
        borderColor: ["rgb(99, 102, 241)", "rgb(99, 102, 241)", "rgb(99, 102, 241)", "rgb(99, 102, 241)"],
        borderWidth: 1,
      },
    ],
  }

  const genderData = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        data: Object.values(genderDistribution).map((value) => {
          const strValue = String(value);
          return parseFloat(strValue.replace('%', ''));
        }),
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)", // Male - blue
          "rgba(244, 114, 182, 0.7)", // Female - pink
          "rgba(139, 92, 246, 0.7)", // Other - purple
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(244, 114, 182)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Audience Demographics</CardTitle>
          <CardDescription>Age, gender, and location breakdown of the audience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Age Distribution</h3>
              <div className="h-64">
                <BarChart data={ageData} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Gender Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <PieChart data={genderData} />
              </div>
            </div>
          </div>

          {topLocations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Top Locations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {topLocations.map((location: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>{location.country}</span>
                    <span className="font-medium">{location.percentage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

