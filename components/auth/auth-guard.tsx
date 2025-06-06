"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AuthGuardProps {
    children: React.ReactNode
    requiredRole?: string | string[]
    requiredPermission?: string
    fallback?: React.ReactNode
}

export function AuthGuard({ children, requiredRole, requiredPermission, fallback }: AuthGuardProps) {
    const { state, hasRole, hasPermission } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!state.isLoading && !state.isAuthenticated) {
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
        }
    }, [state.isLoading, state.isAuthenticated, router, pathname])

    if (state.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Lade Dashboard...</p>
                </div>
            </div>
        )
    }

    if (!state.isAuthenticated) {
        return null // Will redirect to login
    }

    // Check role-based access
    if (requiredRole && !hasRole(requiredRole)) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="text-center p-8">
                        <div className="text-6xl mb-4">🚫</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Zugriff verweigert</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sie haben nicht die erforderlichen Berechtigungen für diese Seite.
                        </p>
                    </div>
                </div>
            )
        )
    }

    // Check permission-based access
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="text-center p-8">
                        <div className="text-6xl mb-4">🔒</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Berechtigung erforderlich</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sie benötigen zusätzliche Berechtigungen für diese Aktion.
                        </p>
                    </div>
                </div>
            )
        )
    }

    return <>{children}</>
}
