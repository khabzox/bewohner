"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Building2, Shield, Camera, Save, Key, Bell } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function ProfileManagement() {
  const { state, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
    department: state.user?.department || "",
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: state.user?.name || "",
      email: state.user?.email || "",
      department: state.user?.department || "",
    })
    setIsEditing(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "inspector":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "tenant":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "manager":
        return "Manager"
      case "inspector":
        return "Inspektor"
      case "tenant":
        return "Mieter"
      default:
        return role
    }
  }

  if (!state.user) return null

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Profil Informationen</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={state.user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {state.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0" variant="outline">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-lg font-medium">{state.user.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>E-Mail</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <p className="text-lg">{state.user.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Rolle</Label>
                  <div>
                    <Badge className={getRoleColor(state.user.role)}>{getRoleLabel(state.user.role)}</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Abteilung</Label>
                  {isEditing ? (
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                    />
                  ) : (
                    <p className="text-lg">{state.user.department}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                      Speichern
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Abbrechen
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profil bearbeiten
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Sicherheit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Passwort</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Zuletzt geändert vor 30 Tagen</p>
              </div>
              <Button variant="outline" size="sm">
                <Key className="mr-2 h-4 w-4" />
                Ändern
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Zwei-Faktor-Authentifizierung</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Zusätzliche Sicherheit für Ihr Konto</p>
              </div>
              <Button variant="outline" size="sm">
                Aktivieren
              </Button>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-2">Aktive Sitzungen</p>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Aktuelle Sitzung</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Chrome auf Windows</p>
                    </div>
                    <Badge variant="secondary">Aktiv</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-purple-600" />
              <span>Einstellungen</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Benachrichtigungen</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">E-Mail-Benachrichtigungen</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push-Benachrichtigungen</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS-Benachrichtigungen</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium">Sprache</Label>
              <Select defaultValue="de">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium">Zeitzone</Label>
              <Select defaultValue="europe/berlin">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe/berlin">Europe/Berlin</SelectItem>
                  <SelectItem value="europe/london">Europe/London</SelectItem>
                  <SelectItem value="america/new_york">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <span>Konto Informationen</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Benutzer-ID</Label>
              <p className="text-lg font-mono">{state.user.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Erstellt am</Label>
              <p className="text-lg">{new Date(state.user.createdAt).toLocaleDateString("de-DE")}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Letzter Login</Label>
              <p className="text-lg">
                {state.user.lastLogin ? new Date(state.user.lastLogin).toLocaleDateString("de-DE") : "Nie"}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <Label className="text-base font-medium">Berechtigungen</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {state.user.permissions.map((permission, index) => (
                <Badge key={index} variant="outline">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
