import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react"

interface RiskAssessmentProps {
  data?: any
}

export function RiskAssessment({ data }: RiskAssessmentProps) {
  // Extract risk data
  const riskFactors = data?.riskFactors || {}
  const redFlags = riskFactors.redFlags || []
  const anomalies = riskFactors.anomalies || []
  const controversies = riskFactors.controversies || []
  
  // Extract auth ratings
  const ratings = data?.ratings || {}
  const authenticity = ratings.authenticity || {}
  
  // Overall assessment
  const overallAssessment = data?.overallAssessment || {}
  const strengths = overallAssessment.strengths || []
  const concerns = overallAssessment.concerns || []
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
        <CardDescription>Potential risks and red flags identified in the analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              Authenticity Rating
            </h3>
            <div className="text-2xl font-bold">{authenticity.score || "6/10"}</div>
            <p className="text-xs text-muted-foreground mb-2">Overall authenticity score</p>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                Risk: {authenticity.riskPercentage || "15%"}
              </Badge>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
              Red Flags ({redFlags.length || 0})
            </h3>
            <div className="space-y-2">
              {redFlags.length > 0 ? (
                redFlags.slice(0, 3).map((flag: string, index: number) => (
                  <div key={index} className="text-xs text-red-500 flex items-start gap-1">
                    <span className="mt-0.5">•</span>
                    <span>{flag}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">No significant red flags detected</div>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              Brand Safety Score
            </h3>
            <div className="text-2xl font-bold">{overallAssessment.brandSuitabilityScore || "7/10"}</div>
            <p className="text-xs text-muted-foreground">Overall brand safety</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
              Key Strengths
            </h3>
            <ul className="space-y-2">
              {strengths.length > 0 ? (
                strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-green-500 font-medium">✓</span>
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-green-500 font-medium">✓</span>
                    <span>Consistent posting schedule and engagement</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-green-500 font-medium">✓</span>
                    <span>Strong audience demographics matching target</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-green-500 font-medium">✓</span>
                    <span>Good brand alignment with content</span>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              Concerns & Anomalies
            </h3>
            <ul className="space-y-2">
              {concerns.length > 0 || anomalies.length > 0 ? (
                [...concerns, ...anomalies].slice(0, 3).map((concern: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-amber-500 font-medium">!</span>
                    <span>{concern}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-amber-500 font-medium">!</span>
                    <span>Occasional inconsistency in posting quality</span>
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <span className="text-amber-500 font-medium">!</span>
                    <span>Some engagement metrics below industry average</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        {controversies.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
              Notable Controversies
            </h3>
            <ul className="space-y-2">
              {controversies.map((controversy: string, index: number) => (
                <li key={index} className="text-sm flex items-start gap-2 text-red-600">
                  <span className="font-medium">•</span>
                  <span>{controversy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {overallAssessment.recommendation && (
          <div className="bg-primary-foreground/10 rounded-lg p-4 border border-primary-foreground/20">
            <h3 className="text-sm font-medium mb-2">Recommendation</h3>
            <p className="text-sm">{overallAssessment.recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

