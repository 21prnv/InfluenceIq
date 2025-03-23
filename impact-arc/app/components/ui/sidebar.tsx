'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { NavSection } from "@/components/ui/nav-section"
import { NavItem } from "@/components/ui/nav-item"
import { cn } from "@/lib/utils"
import { ChevronRight, LayoutDashboard, ListTodo, AppWindow, MessageSquare, Users, ShieldCheck, AlertTriangle, Settings, HelpCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
  onExpandedChange?: (expanded: boolean) => void
}

export function Sidebar({ className, onExpandedChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    onExpandedChange?.(isExpanded)
  }, [isExpanded, onExpandedChange])

  const toggleExpanded = (expanded: boolean) => {
    setIsExpanded(expanded)
  }

  return (
    <div className={cn(
      "flex flex-col gap-4 p-4 border-r border-border/50 bg-background/50 backdrop-blur-sm",
      isExpanded ? "w-64" : "w-[80px]",
      "transition-all duration-300",
      className
    )}>
      <div className="flex items-center gap-3 px-2">
        {isExpanded ? (
          <>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold">ImpactArc</h3>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => toggleExpanded(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={() => toggleExpanded(true)}
          >
            <div className="h-8 w-8 rounded-lg border border-border/50 flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <NavSection title="General" isExpanded={isExpanded}>
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            isExpanded={isExpanded}
          />
          <NavItem
            href="/tasks"
            icon={<ListTodo className="h-4 w-4" />}
            label="Tasks"
            isExpanded={isExpanded}
          />
          <NavItem
            href="/apps"
            icon={<AppWindow className="h-4 w-4" />}
            label="Apps"
            isExpanded={isExpanded}
          />
          <NavItem
            href="/chats"
            icon={<MessageSquare className="h-4 w-4" />}
            label="Chats"
            badge="3"
            isExpanded={isExpanded}
          />
          <NavItem
            href="/users"
            icon={<Users className="h-4 w-4" />}
            label="Users"
            isExpanded={isExpanded}
          />
        </NavSection>

        <NavSection title="Pages" className="mt-6" isExpanded={isExpanded}>
          <NavItem
            href="/auth"
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Auth"
            isExpanded={isExpanded}
          />
          <NavItem
            href="/errors"
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Errors"
            isExpanded={isExpanded}
          />
        </NavSection>

        <NavSection title="Other" className="mt-6" isExpanded={isExpanded}>
          <NavItem
            href="/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
            isExpanded={isExpanded}
          />
          <NavItem
            href="/help"
            icon={<HelpCircle className="h-4 w-4" />}
            label="Help Center"
            isExpanded={isExpanded}
          />
        </NavSection>
      </div>

      <div className={cn(
        "flex items-center gap-3 p-2 rounded-lg border border-border/50",
        !isExpanded && "justify-center"
      )}>
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>SN</AvatarFallback>
        </Avatar>
        {isExpanded && (
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">satnaing</p>
            <p className="text-xs text-muted-foreground truncate">satnaingdev@gmail.com</p>
          </div>
        )}
      </div>
    </div>
  )
} 