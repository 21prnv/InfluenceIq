'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  badge?: string | number
  isChild?: boolean
  isExpanded?: boolean
}

export function NavItem({ href, icon, label, badge, isChild, isExpanded }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground",
        isChild && "ml-4",
        !isExpanded && "justify-center"
      )}
    >
      <div className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg border border-border/50",
        isActive && "border-border"
      )}>
        {icon}
      </div>
      {isExpanded && (
        <>
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
} 