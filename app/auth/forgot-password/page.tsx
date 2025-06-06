"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, ArrowLeft, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const { resetPassword } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await resetPassword(email)
            setIsSubmitted(true)
        } catch (error) {
            // Error handling is done in the auth context
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl shadow-lg mb-4">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">E-Mail gesendet</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Überprüfen Sie Ihre E-Mail für weitere Anweisungen</p>
                    </div>

                    <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Wir haben eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts an{" "}
                                    <span className="font-medium text-gray-900 dark:text-white">{email}</span> gesendet.
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Überprüfen Sie auch Ihren Spam-Ordner, falls Sie die E-Mail nicht erhalten haben.
                                </p>
                                <Link href="/auth/login">
                                    <Button className="w-full">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Zurück zur Anmeldung
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Passwort vergessen</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen
                    </p>
                </div>

                {/* Reset Form */}
                <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Passwort zurücksetzen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-Mail-Adresse</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ihre.email@beispiel.de"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                                disabled={isLoading}
                            >
                                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                Reset-Link senden
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                <ArrowLeft className="inline mr-1 h-4 w-4" />
                                Zurück zur Anmeldung
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
