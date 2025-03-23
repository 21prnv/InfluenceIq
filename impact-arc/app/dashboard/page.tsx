'use client'

import { StatCard } from "@/components/ui/stat-card"
import { RecentSales } from "@/components/ui/recent-sales"
import { OverviewChart } from "@/components/ui/overview-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const overviewData = [
  { name: "Jan", total: 4500 },
  { name: "Feb", total: 3500 },
  { name: "Mar", total: 2000 },
  { name: "Apr", total: 2780 },
  { name: "May", total: 1890 },
  { name: "Jun", total: 2390 },
  { name: "Jul", total: 3490 },
  { name: "Aug", total: 2000 },
  { name: "Sep", total: 2780 },
  { name: "Oct", total: 1890 },
  { name: "Nov", total: 2390 },
  { name: "Dec", total: 3490 },
]

const recentSales = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00"
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00"
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00"
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00"
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00"
  }
]

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-black">
      
      <div className="relative z-10 flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Revenue"
                value="$45,231.89"
                trend={{
                  value: "20.1%",
                  isPositive: true,
                  label: "from last month"
                }}
              />
              <StatCard
                title="Subscriptions"
                value="+2,350"
                trend={{
                  value: "180.1%",
                  isPositive: true,
                  label: "from last month"
                }}
              />
              <StatCard
                title="Sales"
                value="+12,234"
                trend={{
                  value: "19%",
                  isPositive: true,
                  label: "from last month"
                }}
              />
              <StatCard
                title="Active Now"
                value="+573"
                trend={{
                  value: "201",
                  isPositive: true,
                  label: "since last hour"
                }}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <OverviewChart 
                data={overviewData} 
                className="col-span-4"
              />
              <RecentSales
                sales={recentSales}
                subtitle="You made 265 sales this month."
                className="col-span-3"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 