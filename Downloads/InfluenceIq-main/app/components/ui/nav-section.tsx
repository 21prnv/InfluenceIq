'use client'

import { cn } from "@/lib/utils"

interface NavSectionProps {
  title?: string
  children: React.ReactNode
  className?: string
  isExpanded?: boolean
}

export function NavSection({ title, children, className, isExpanded }: NavSectionProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {title && isExpanded && (
        <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground">
          {title}
        </h4>
      )}
      {children}
    </div>
  )
} 