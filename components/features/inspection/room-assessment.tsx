"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Home } from "lucide-react"
import { useProperty } from "@/components/providers/property-provider"

export function RoomAssessment() {
  const { state, actions } = useProperty()

  const updateRoomCondition = (room: string, condition: "gut" | "okay" | "schlecht") => {
    const updatedRooms = {
      ...state.inspection.rooms,
      [room]: {
        ...state.inspection.rooms[room],
        condition,
      },
    }
    actions.updateInspection({ rooms: updatedRooms })
  }

  const updateRoomNotes = (room: string, notes: string) => {
    const updatedRooms = {
      ...state.inspection.rooms,
      [room]: {
        ...state.inspection.rooms[room],
        notes,
      },
    }
    actions.updateInspection({ rooms: updatedRooms })
  }

  return (
    <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Home className="h-5 w-5 text-purple-600" />
          <span>Aufträge History</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Kategorie | aufgenommen am | Mail raus</p>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox checked className="data-[state=checked]:bg-green-500" />
                    <span className="text-sm">History List</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400">erledigt</Badge>
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">YES</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Assessment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(state.inspection.rooms).map(([room, data]) => (
              <div
                key={room}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg"
              >
                <div className="text-center mb-4">
                  <h3 className="font-medium capitalize mb-2">{room}</h3>
                  <div className="space-y-2">
                    <RadioGroup
                      value={data.condition}
                      onValueChange={(value) => updateRoomCondition(room, value as "gut" | "okay" | "schlecht")}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="schlecht"
                          id={`${room}-schlecht`}
                          className="border-red-500 text-red-500"
                        />
                        <Label htmlFor={`${room}-schlecht`} className="text-sm">
                          schlecht
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="okay" id={`${room}-okay`} className="border-gray-500 text-gray-500" />
                        <Label htmlFor={`${room}-okay`} className="text-sm">
                          okay
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gut" id={`${room}-gut`} className="border-yellow-500 text-yellow-500" />
                        <Label htmlFor={`${room}-gut`} className="text-sm">
                          gut
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <Textarea
                  placeholder="Notizen..."
                  value={data.notes}
                  onChange={(e) => updateRoomNotes(room, e.target.value)}
                  className="text-sm"
                  rows={2}
                />
              </div>
            ))}
          </div>

          {/* Overall Score */}
          <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-4">
              <div>
                <div className="text-6xl font-bold text-blue-600">{state.inspection.overallScore}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Note - Gut</div>
              </div>
              <div className="text-left">
                <div className="text-sm text-gray-600 dark:text-gray-400">ERgebnis</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
