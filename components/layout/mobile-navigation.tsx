"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Users, FileText, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { id: "übersicht", label: "Übersicht", icon: Home, href: "/", color: "bg-blue-500" },
  { id: "belegung", label: "Belegung", icon: Users, href: "/belegung", color: "bg-green-500" },
  { id: "aufträge", label: "Aufträge", icon: FileText, href: "/auftraege", color: "bg-red-500" },
  { id: "mobiliar", label: "Mobiliar", icon: Settings, href: "/mobiliar", color: "bg-orange-500" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics", color: "bg-violet-500" },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="grid grid-cols-5 gap-1 p-2">
        {mobileNavItems.map((item) => (
          <Button
            key={item.id}
            variant={pathname === item.href ? "default" : "ghost"}
            size="sm"
            className={cn(
              "flex flex-col items-center space-y-1 h-auto py-2 transition-all duration-200",
              pathname === item.href && item.color,
              "hover:scale-105",
            )}
            onClick={() => router.push(item.href)}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
