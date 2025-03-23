'use client'

import { useState } from "react"
import { Sidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        className="fixed left-0 top-0 bottom-0 z-30" 
        onExpandedChange={setIsSidebarExpanded}
      />
      <main className={cn(
        "flex-1 transition-[padding] duration-300",
        isSidebarExpanded ? "pl-64" : "pl-[80px]"
      )}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 