"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Search, Plus, MoreHorizontal, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react"
import { useAuth, type User } from "@/lib/auth/auth-context"

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Sarah Schmidt",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
    department: "Administration",
    permissions: ["read:all", "write:all", "delete:all", "manage:users", "manage:roles"],
    lastLogin: "2024-01-15T10:30:00Z",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    email: "manager@example.com",
    name: "Max Weber",
    role: "manager",
    avatar: "/placeholder.svg?height=32&width=32",
    department: "Property Management",
    permissions: ["read:properties", "write:properties", "read:tenants", "write:tenants"],
    lastLogin: "2024-01-14T16:45:00Z",
    isActive: true,
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "3",
    email: "tenant@example.com",
    name: "Anna Müller",
    role: "tenant",
    avatar: "/placeholder.svg?height=32&width=32",
    department: "Resident",
    permissions: ["read:own", "write:own"],
    lastLogin: "2024-01-13T14:20:00Z",
    isActive: true,
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
  },
  {
    id: "4",
    email: "inspector@example.com",
    name: "Tom Fischer",
    role: "inspector",
    avatar: "/placeholder.svg?height=32&width=32",
    department: "Quality Control",
    permissions: ["read:inspections", "write:inspections", "read:properties"],
    lastLogin: "2024-01-12T09:15:00Z",
    isActive: false,
    createdAt: "2023-04-01T00:00:00Z",
    updatedAt: "2024-01-12T09:15:00Z",
  },
]

export function UserManagement() {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

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

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user)))
  }

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  if (!hasPermission("manage:users")) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Keine Berechtigung</h3>
        <p className="text-gray-600 dark:text-gray-400">Sie haben keine Berechtigung zur Benutzerverwaltung.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Benutzerverwaltung</h1>
          <p className="text-gray-600 dark:text-gray-400">Verwalten Sie Benutzer und deren Berechtigungen</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neuer Benutzer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Neuen Benutzer erstellen</DialogTitle>
            </DialogHeader>
            <CreateUserForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Benutzer suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Rolle filtern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Rollen</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="inspector">Inspektor</SelectItem>
                <SelectItem value="tenant">Mieter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Benutzer ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
                      {!user.isActive && (
                        <Badge variant="destructive" className="text-xs">
                          Deaktiviert
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                      <span className="text-xs text-gray-500">{user.department}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    <p>Letzter Login:</p>
                    <p>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("de-DE") : "Nie"}</p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                        {user.isActive ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Deaktivieren
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Aktivieren
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => deleteUser(user.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Benutzer bearbeiten</DialogTitle>
            </DialogHeader>
            <EditUserForm
              user={editingUser}
              onClose={() => setEditingUser(null)}
              onSave={(updatedUser) => {
                setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
                setEditingUser(null)
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CreateUserForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "tenant",
    department: "",
    permissions: [] as string[],
  })

  const allPermissions = [
    "read:all",
    "write:all",
    "delete:all",
    "read:properties",
    "write:properties",
    "read:tenants",
    "write:tenants",
    "read:inspections",
    "write:inspections",
    "manage:users",
    "manage:roles",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically call an API to create the user
    console.log("Creating user:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rolle</Label>
        <Select value={formData.role} onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="inspector">Inspektor</SelectItem>
            <SelectItem value="tenant">Mieter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Abteilung</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Berechtigungen</Label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {allPermissions.map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={permission}
                checked={formData.permissions.includes(permission)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData((prev) => ({
                      ...prev,
                      permissions: [...prev.permissions, permission],
                    }))
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      permissions: prev.permissions.filter((p) => p !== permission),
                    }))
                  }
                }}
              />
              <Label htmlFor={permission} className="text-xs">
                {permission}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          Erstellen
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Abbrechen
        </Button>
      </div>
    </form>
  )
}

function EditUserForm({
  user,
  onClose,
  onSave,
}: {
  user: User
  onClose: () => void
  onSave: (user: User) => void
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department || "",
    permissions: user.permissions,
    isActive: user.isActive,
  })

  const allPermissions = [
    "read:all",
    "write:all",
    "delete:all",
    "read:properties",
    "write:properties",
    "read:tenants",
    "write:tenants",
    "read:inspections",
    "write:inspections",
    "manage:users",
    "manage:roles",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedUser: User = {
      ...user,
      ...formData,
      updatedAt: new Date().toISOString(),
    }
    onSave(updatedUser)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rolle</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as any }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="inspector">Inspektor</SelectItem>
            <SelectItem value="tenant">Mieter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Abteilung</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked as boolean }))}
        />
        <Label htmlFor="isActive">Benutzer ist aktiv</Label>
      </div>

      <div className="space-y-2">
        <Label>Berechtigungen</Label>
        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {allPermissions.map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={permission}
                checked={formData.permissions.includes(permission)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData((prev) => ({
                      ...prev,
                      permissions: [...prev.permissions, permission],
                    }))
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      permissions: prev.permissions.filter((p) => p !== permission),
                    }))
                  }
                }}
              />
              <Label htmlFor={permission} className="text-xs">
                {permission}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          Speichern
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Abbrechen
        </Button>
      </div>
    </form>
  )
}
