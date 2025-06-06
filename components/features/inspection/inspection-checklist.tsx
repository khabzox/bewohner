"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Check, AlertTriangle, Camera, Mic, Plus } from "lucide-react"
import { useProperty } from "@/components/providers/property-provider"

export function InspectionChecklist() {
  const { state, actions } = useProperty()

  const updateItemCondition = (itemId: string, condition: "vorhanden" | "defekt" | "notiz") => {
    const updatedItems = state.inspection.rgtItems.map((item) => (item.id === itemId ? { ...item, condition } : item))
    actions.updateInspection({ rgtItems: updatedItems })
  }

  const updateItemQuantity = (itemId: string, delta: number) => {
    const updatedItems = state.inspection.rgtItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
    )
    actions.updateInspection({ rgtItems: updatedItems })
  }

  return (
    <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Inspection Checklist</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">RGT</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mobiliar List: {state.inspection.furniture.total} Möbelstücke+
            </div>
            <Progress value={state.inspection.completionRate} className="w-24" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-2">Anzahl</div>
            <div className="col-span-3">vorhanden</div>
            <div className="col-span-2">defekt</div>
            <div className="col-span-2">Notiz</div>
            <div className="col-span-3">Aktionen</div>
          </div>

          {state.inspection.rgtItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-2 items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {/* Quantity Controls */}
              <div className="col-span-2 flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => updateItemQuantity(item.id, -1)}
                >
                  -
                </Button>
                <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center font-medium text-sm">
                  {item.quantity}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => updateItemQuantity(item.id, 1)}
                >
                  +
                </Button>
              </div>

              {/* Condition Buttons */}
              <div className="col-span-3">
                <Button
                  variant={item.condition === "vorhanden" ? "default" : "outline"}
                  size="sm"
                  className={`w-full h-8 ${item.condition === "vorhanden" ? "bg-green-600 hover:bg-green-700" : ""}`}
                  onClick={() => updateItemCondition(item.id, "vorhanden")}
                >
                  <Check className="h-4 w-4 mr-1" />
                  vorhanden
                </Button>
              </div>

              <div className="col-span-2">
                <Button
                  variant={item.condition === "defekt" ? "destructive" : "outline"}
                  size="sm"
                  className="w-full h-8"
                  onClick={() => updateItemCondition(item.id, "defekt")}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  defekt
                </Button>
              </div>

              <div className="col-span-2">
                <Button
                  variant={item.condition === "notiz" ? "secondary" : "outline"}
                  size="sm"
                  className="w-full h-8"
                  onClick={() => updateItemCondition(item.id, "notiz")}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Notiz
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="col-span-3 flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Camera className={`h-4 w-4 ${item.hasPhoto ? "text-green-600" : "text-gray-400"}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Mic className="h-4 w-4 text-gray-400" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Item Name */}
              <div className="col-span-12 mt-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
          ))}

          {/* Photo Gallery */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="h-16 w-16 p-0">
                <Camera className="h-8 w-8 text-gray-400" />
              </Button>
              <div className="grid grid-cols-4 gap-2 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center"
                  >
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="h-16 w-16 p-0">
                <Plus className="h-8 w-8 text-gray-400" />
                <span className="sr-only">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
