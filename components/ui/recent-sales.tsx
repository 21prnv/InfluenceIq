'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Sale {
  name: string
  email: string
  amount: string
  avatarSrc?: string
}

interface RecentSalesProps {
  sales: Sale[]
  title?: string
  subtitle?: string
  className?: string
}

export function RecentSales({ sales, title = "Recent Sales", subtitle, className }: RecentSalesProps) {
  return (
    <Card className={cn("bg-background/50 backdrop-blur-sm", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sales.map((sale, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={sale.avatarSrc} />
                  <AvatarFallback>
                    {sale.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{sale.name}</p>
                  <p className="text-sm text-muted-foreground">{sale.email}</p>
                </div>
              </div>
              <div className="text-sm font-medium">{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 