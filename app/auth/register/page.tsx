"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "tenant",
        department: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { register } = useAuth()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name ist erforderlich"
        }

        if (!formData.email.trim()) {
            newErrors.email = "E-Mail ist erforderlich"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Ungültige E-Mail-Adresse"
        }

        if (!formData.password) {
            newErrors.password = "Passwort ist erforderlich"
        } else if (formData.password.length < 8) {
            newErrors.password = "Passwort muss mindestens 8 Zeichen lang sein"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwörter stimmen nicht überein"
        }

        if (!acceptTerms) {
            newErrors.terms = "Sie müssen den Nutzungsbedingungen zustimmen"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                department: formData.department,
            })
        } catch (error) {
            // Error handling is done in the auth context
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Konto erstellen</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Registrieren Sie sich für das Dashboard</p>
                </div>

                {/* Registration Form */}
                <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Registrierung</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Vollständiger Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Max Mustermann"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-Mail-Adresse</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ihre.email@beispiel.de"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Rolle</Label>
                                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tenant">Mieter</SelectItem>
                                            <SelectItem value="inspector">Inspektor</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Abteilung</Label>
                                    <Input
                                        id="department"
                                        type="text"
                                        placeholder="z.B. Verwaltung"
                                        value={formData.department}
                                        onChange={(e) => handleInputChange("department", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Passwort</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mindestens 8 Zeichen"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Passwort wiederholen"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onCheckedChange={(checked) => {
                                        setAcceptTerms(checked as boolean)
                                        if (errors.terms) {
                                            setErrors((prev) => ({ ...prev, terms: "" }))
                                        }
                                    }}
                                />
                                <Label htmlFor="terms" className="text-sm">
                                    Ich stimme den{" "}
                                    <Link href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                        Nutzungsbedingungen
                                    </Link>{" "}
                                    und der{" "}
                                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                        Datenschutzerklärung
                                    </Link>{" "}
                                    zu
                                </Label>
                            </div>
                            {errors.terms && <p className="text-sm text-red-600">{errors.terms}</p>}

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                                disabled={isLoading}
                            >
                                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                Konto erstellen
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Bereits ein Konto?{" "}
                                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Anmelden
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
