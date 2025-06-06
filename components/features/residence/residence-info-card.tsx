"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Save, Download, Printer, Camera, FileImage, Maximize2 } from "lucide-react"
import { useProperty } from "@/components/providers/property-provider"

export function ResidenceInfoCard() {
  const { state, actions } = useProperty()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    actions.updateResident({ [field]: value })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving-in":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400"
      case "moving-out":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400"
      case "occupied":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      case "vacant":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700/50 dark:text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "moving-in":
        return "Einzug"
      case "moving-out":
        return "Auszug"
      case "occupied":
        return "Bewohnt"
      case "vacant":
        return "Leer"
      default:
        return status
    }
  }

  return (
    <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Residence Info</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(state.resident.status)} transition-all duration-300`}>
              {getStatusLabel(state.resident.status)}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Floor Plan */}
        <div className="relative group">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden shadow-inner">
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">3D Floor Plan</p>
              </div>
            </div>

            {/* PDF Export Button */}
            <div className="absolute top-4 left-4">
              <Button variant="secondary" size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                <FileImage className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>

            {/* Schlüsselnummer */}
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400">
                Schlüsselnummer: {state.resident.schlüsselnummer}
              </Badge>
            </div>
          </div>
        </div>

        {/* Resident Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">RESIDENT NAME</Label>
              <Input
                value={state.resident.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nachfolger</Label>
              <Input
                value={state.resident.nachfolger || ""}
                onChange={(e) => handleInputChange("nachfolger", e.target.value)}
                placeholder="Nachfolger eingeben..."
                className="mt-1 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">INSPECTED BY</Label>
              <Input
                value={state.resident.inspector}
                onChange={(e) => handleInputChange("inspector", e.target.value)}
                className="mt-1 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</Label>
              <Select value={state.resident.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="mt-1 bg-cyan-100 dark:bg-cyan-900/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moving-in">Moving in</SelectItem>
                  <SelectItem value="moving-out">Moving out</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">MOVING OUT DATE</Label>
              <div className="relative mt-1">
                <Input
                  type="date"
                  value={state.resident.moveOutDate}
                  onChange={(e) => handleInputChange("moveOutDate", e.target.value)}
                  className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">moving in</Label>
              <div className="relative mt-1">
                <Input
                  type="date"
                  value={state.resident.moveInDate}
                  onChange={(e) => handleInputChange("moveInDate", e.target.value)}
                  className="bg-cyan-100 dark:bg-cyan-900/20 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload Zone */}
        {isExpanded && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-300">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Fotos hier ablegen oder klicken zum Hochladen</p>
            <Button variant="outline" className="mt-4">
              <FileImage className="mr-2 h-4 w-4" />
              Dateien auswählen
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => actions.updateResident(state.resident)}
          >
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PDF Export
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Drucken
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
