import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ContentAnalysisProps {
  data?: any
}

export function ContentAnalysis({ data }: ContentAnalysisProps) {
  // Extract content data
  const ratings = data?.ratings || {}
  const contentRating = ratings.content || {}
  const categoryData = data?.categoryClassification || {}
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Analysis</CardTitle>
        <CardDescription>Content categorization and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Content Rating</h3>
              <div className="text-2xl font-bold">{contentRating.score || "7/10"}</div>
              <p className="text-xs text-muted-foreground">Overall quality</p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Consistency</h3>
              <div className="text-2xl font-bold">{contentRating.consistency || "80%"}</div>
              <p className="text-xs text-muted-foreground">Posting regularity</p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium">Niche Alignment</h3>
              <div className="text-2xl font-bold">{contentRating.categoryAlignment || "75%"}</div>
              <p className="text-xs text-muted-foreground">Content-category match</p>
            </div>
          </div>

          <div className="mt-2">
            <h3 className="text-sm font-medium mb-3">Primary Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categoryData.primary && (
                <Badge className="bg-primary/90">
                  {categoryData.primary.name} ({categoryData.primary.percentage})
                </Badge>
              )}
              
              {categoryData.secondary && categoryData.secondary.map((category: any, index: number) => (
                <Badge key={index} variant="secondary">
                  {category.name} ({category.percentage})
                </Badge>
              ))}
              
              {(!categoryData.primary && (!categoryData.secondary || categoryData.secondary.length === 0)) && (
                <>
                  <Badge className="bg-primary/90">Entertainment (60%)</Badge>
                  <Badge variant="secondary">Lifestyle (25%)</Badge>
                  <Badge variant="secondary">Fashion (15%)</Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

