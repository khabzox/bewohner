"use client"
import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MaintenanceOrders } from "@/components/features/maintenance/maintenance-orders"

export function AuftraegePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wartungsaufträge</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Neuer Auftrag
          </Button>
        </div>
      </div>

      <MaintenanceOrders />
    </div>
  )
}
