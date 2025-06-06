"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Filter, Eye, Edit } from "lucide-react"

const activityHistory = [
  {
    id: 1,
    type: "inspection",
    title: "Zimmer 0106 inspiziert",
    user: "Sarah Schmidt",
    date: "2024-01-15T10:30:00",
    status: "completed",
  },
  {
    id: 2,
    type: "maintenance",
    title: "Fenster repariert",
    user: "Max Weber",
    date: "2024-01-15T09:15:00",
    status: "completed",
  },
  {
    id: 3,
    type: "resident",
    title: "Neuer Bewohner eingezogen",
    user: "Anna Müller",
    date: "2024-01-14T16:45:00",
    status: "active",
  },
  {
    id: 4,
    type: "inspection",
    title: "Schaden gemeldet",
    user: "Tom Fischer",
    date: "2024-01-14T14:20:00",
    status: "pending",
  },
]

export function ActivityTimeline() {
  return (
    <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span>Aktivitäten</span>
          </CardTitle>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityHistory.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === "completed"
                    ? "bg-green-500"
                    : activity.status === "pending"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.user}</p>
                <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleString("de-DE")}</p>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
