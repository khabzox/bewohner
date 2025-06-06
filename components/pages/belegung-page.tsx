"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Home, TrendingUp } from "lucide-react"
import { useProperty } from "@/components/providers/property-provider"

export function BelegungPage() {
  const { state } = useProperty()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Belegung</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-green-600" />
              <span>Belegt</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{state.analytics.occupancy.belegt}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <TrendingUp className="h-3 w-3" />
              <span>+5% vs. letzter Monat</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Home className="h-4 w-4 text-blue-600" />
              <span>Frei</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{state.analytics.occupancy.frei}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <TrendingUp className="h-3 w-3" />
              <span>-2% vs. letzter Monat</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Home className="h-4 w-4 text-red-600" />
              <span>Nicht nutzbar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{state.analytics.occupancy.nichtNutzbar}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <TrendingUp className="h-3 w-3" />
              <span>+1% vs. letzter Monat</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Home className="h-4 w-4 text-gray-600" />
              <span>Sibo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{state.analytics.occupancy.sibo}</div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <TrendingUp className="h-3 w-3" />
              <span>0% vs. letzter Monat</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional content for Belegung page */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardHeader>
          <CardTitle>Belegungsdetails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belegungsübersicht</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Detaillierte Belegungsinformationen werden hier angezeigt.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
