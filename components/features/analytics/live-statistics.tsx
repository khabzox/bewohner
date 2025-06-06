"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, Search } from "lucide-react"
import { useProperty } from "@/components/providers/property-provider"

export function LiveStatistics() {
  const { state } = useProperty()

  const renderOccupancyChart = () => (
    <div className="relative">
      <div className="w-32 h-32 mx-auto relative">
        {/* Donut Chart Simulation */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${(state.analytics.occupancy.belegt / state.analytics.occupancy.total) * 251.2} 251.2`}
            className="text-blue-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round((state.analytics.occupancy.belegt / state.analytics.occupancy.total) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Belegt</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-400">Belegt: {state.analytics.occupancy.belegt}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-400">
            Nicht nutzbar: {state.analytics.occupancy.nichtNutzbar}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-400">Frei: {state.analytics.occupancy.frei}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full" />
          <span className="text-gray-600 dark:text-gray-400">Sibo: {state.analytics.occupancy.sibo}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* SFB A Overview */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>SFB A Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex-1 bg-cyan-100 dark:bg-cyan-900/20">
                Nachweise
              </Button>
              <Button variant="outline" className="flex-1 bg-cyan-100 dark:bg-cyan-900/20">
                Schlüssel
              </Button>
            </div>
            <div className="relative">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-gray-400" />
                <Input placeholder="Suchen..." className="bg-blue-100 dark:bg-blue-900/20" />
              </div>
              <Button variant="outline" className="w-full bg-cyan-100 dark:bg-cyan-900/20">
                Formulare
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupancy Statistics */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-sm">Stuben (Belegt/Nicht nutzbar/Frei)</CardTitle>
        </CardHeader>
        <CardContent>{renderOccupancyChart()}</CardContent>
      </Card>

      {/* Bestellungen */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bestellungen</span>
            <div className="text-2xl font-bold">{state.analytics.bestellungen.total}</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {state.analytics.bestellungen.categories.map((cat, index) => (
              <div key={index} className="text-center p-2 bg-teal-600 text-white rounded">
                <div className="text-lg font-bold">{cat.count}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <span>Männer</span>
              <span className="font-bold">439</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <span>Sibo</span>
              <span className="font-bold">411</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <span>311</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <span>308</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
