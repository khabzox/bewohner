"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Users, FileText, Settings, BarChart3, Building2, X, Key, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigationItems = [
  { id: "übersicht", label: "Übersicht", icon: Home, href: "/", color: "bg-blue-500", requiredRole: null },
  { id: "belegung", label: "Belegung", icon: Users, href: "/belegung", color: "bg-green-500", requiredRole: null },
  { id: "leer", label: "Leer", icon: Home, href: "/leer", color: "bg-gray-500", requiredRole: ["manager", "admin"] },
  {
    id: "ämter",
    label: "Ämter",
    icon: Building2,
    href: "/aemter",
    color: "bg-purple-500",
    requiredRole: ["manager", "admin"],
  },
  { id: "aufträge", label: "Aufträge", icon: FileText, href: "/auftraege", color: "bg-red-500", requiredRole: null },
  {
    id: "mobiliar",
    label: "Mobiliar",
    icon: Settings,
    href: "/mobiliar",
    color: "bg-orange-500",
    requiredRole: ["inspector", "manager", "admin"],
  },
  {
    id: "geschlossen",
    label: "Geschlossen",
    icon: X,
    href: "/geschlossen",
    color: "bg-yellow-500",
    requiredRole: ["manager", "admin"],
  },
  {
    id: "gebäude",
    label: "Gebäude",
    icon: Building2,
    href: "/gebaeude",
    color: "bg-indigo-500",
    requiredRole: ["manager", "admin"],
  },
  {
    id: "rgts",
    label: "RGT's",
    icon: FileText,
    href: "/rgts",
    color: "bg-pink-500",
    requiredRole: ["inspector", "manager", "admin"],
  },
  {
    id: "schlüssel",
    label: "Schlüssel",
    icon: Key,
    href: "/schluessel",
    color: "bg-cyan-500",
    requiredRole: ["manager", "admin"],
  },
  {
    id: "nachweise",
    label: "Nachweise",
    icon: Shield,
    href: "/nachweise",
    color: "bg-emerald-500",
    requiredRole: null,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "bg-violet-500",
    requiredRole: ["manager", "admin"],
  },
]

const adminItems = [
  { id: "profile", label: "Profil", icon: User, href: "/profile", color: "bg-blue-500" },
  { id: "users", label: "Benutzer", icon: Users, href: "/admin/users", color: "bg-red-500", requiredRole: "admin" },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { hasRole, state } = useAuth()

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
  }

  const isItemVisible = (item: any) => {
    if (!item.requiredRole) return true
    if (Array.isArray(item.requiredRole)) {
      return item.requiredRole.some((role) => hasRole(role))
    }
    return hasRole(item.requiredRole)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Wohnanlage</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{state.user?.name}</span>
          </div>
          <Badge className="mt-1 text-xs" variant="secondary">
            {state.user?.role}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Navigation
            </h3>
            {navigationItems.filter(isItemVisible).map((item) => (
              <Button
                key={item.id}
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start space-x-3 h-12 transition-all duration-200",
                  pathname === item.href && item.color,
                  "hover:scale-105 hover:shadow-md",
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Admin Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Konto
            </h3>
            {adminItems.filter(isItemVisible).map((item) => (
              <Button
                key={item.id}
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start space-x-3 h-12 transition-all duration-200",
                  pathname === item.href && item.color,
                  "hover:scale-105 hover:shadow-md",
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
