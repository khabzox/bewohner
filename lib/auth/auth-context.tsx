"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export interface User {
    id: string
    email: string
    name: string
    role: "admin" | "manager" | "tenant" | "inspector"
    avatar?: string
    department?: string
    permissions: string[]
    lastLogin?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    sessionExpiry: number | null
}

type AuthAction =
    | { type: "LOGIN_START" }
    | { type: "LOGIN_SUCCESS"; payload: { user: User; sessionExpiry: number } }
    | { type: "LOGIN_FAILURE"; payload: string }
    | { type: "LOGOUT" }
    | { type: "UPDATE_USER"; payload: Partial<User> }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "REFRESH_SESSION"; payload: number }

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    sessionExpiry: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN_START":
            return { ...state, isLoading: true, error: null }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                sessionExpiry: action.payload.sessionExpiry,
            }
        case "LOGIN_FAILURE":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
                sessionExpiry: null,
            }
        case "LOGOUT":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                sessionExpiry: null,
            }
        case "UPDATE_USER":
            return {
                ...state,
                user: state.user ? { ...state.user, ...action.payload } : null,
            }
        case "SET_LOADING":
            return { ...state, isLoading: action.payload }
        case "SET_ERROR":
            return { ...state, error: action.payload }
        case "REFRESH_SESSION":
            return { ...state, sessionExpiry: action.payload }
        default:
            return state
    }
}

interface AuthContextType {
    state: AuthState
    login: (email: string, password: string) => Promise<void>
    register: (userData: RegisterData) => Promise<void>
    logout: () => void
    resetPassword: (email: string) => Promise<void>
    updateProfile: (data: Partial<User>) => Promise<void>
    refreshSession: () => Promise<void>
    hasPermission: (permission: string) => boolean
    hasRole: (role: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface RegisterData {
    email: string
    password: string
    name: string
    role?: string
    department?: string
}

// Mock API functions (replace with real API calls)
const authAPI = {
    async login(email: string, password: string): Promise<{ user: User; token: string; expiresIn: number }> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock user data
        const mockUsers = {
            "admin@example.com": {
                id: "1",
                email: "admin@example.com",
                name: "Sarah Schmidt",
                role: "admin" as const,
                avatar: "/placeholder.svg?height=32&width=32",
                department: "Administration",
                permissions: ["read:all", "write:all", "delete:all", "manage:users", "manage:roles"],
                lastLogin: new Date().toISOString(),
                isActive: true,
                createdAt: "2023-01-01T00:00:00Z",
                updatedAt: new Date().toISOString(),
            },
            "manager@example.com": {
                id: "2",
                email: "manager@example.com",
                name: "Max Weber",
                role: "manager" as const,
                avatar: "/placeholder.svg?height=32&width=32",
                department: "Property Management",
                permissions: ["read:properties", "write:properties", "read:tenants", "write:tenants"],
                lastLogin: new Date().toISOString(),
                isActive: true,
                createdAt: "2023-01-01T00:00:00Z",
                updatedAt: new Date().toISOString(),
            },
            "tenant@example.com": {
                id: "3",
                email: "tenant@example.com",
                name: "Anna Müller",
                role: "tenant" as const,
                avatar: "/placeholder.svg?height=32&width=32",
                department: "Resident",
                permissions: ["read:own", "write:own"],
                lastLogin: new Date().toISOString(),
                isActive: true,
                createdAt: "2023-01-01T00:00:00Z",
                updatedAt: new Date().toISOString(),
            },
        }

        const user = mockUsers[email as keyof typeof mockUsers]
        if (!user || password !== "password123") {
            throw new Error("Invalid credentials")
        }

        return {
            user,
            token: "mock-jwt-token",
            expiresIn: 3600000, // 1 hour
        }
    },

    async register(userData: RegisterData): Promise<{ user: User; token: string; expiresIn: number }> {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email: userData.email,
            name: userData.name,
            role: (userData.role as any) || "tenant",
            department: userData.department || "Resident",
            permissions: userData.role === "admin" ? ["read:all", "write:all"] : ["read:own", "write:own"],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        return {
            user: newUser,
            token: "mock-jwt-token",
            expiresIn: 3600000,
        }
    },

    async resetPassword(email: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Mock password reset
    },

    async updateProfile(userId: string, data: Partial<User>): Promise<User> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Mock profile update
        return { ...data } as User
    },

    async refreshToken(): Promise<{ token: string; expiresIn: number }> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
            token: "new-mock-jwt-token",
            expiresIn: 3600000,
        }
    },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState)
    const router = useRouter()
    const { toast } = useToast()

    // Session management
    useEffect(() => {
        const checkSession = () => {
            const token = localStorage.getItem("auth-token")
            const expiry = localStorage.getItem("session-expiry")

            if (token && expiry) {
                const expiryTime = Number.parseInt(expiry)
                if (Date.now() < expiryTime) {
                    // Session is valid, restore user
                    const userData = localStorage.getItem("user-data")
                    if (userData) {
                        const user = JSON.parse(userData)
                        dispatch({ type: "LOGIN_SUCCESS", payload: { user, sessionExpiry: expiryTime } })
                    }
                } else {
                    // Session expired
                    logout()
                }
            }
            dispatch({ type: "SET_LOADING", payload: false })
        }

        checkSession()
    }, [])

    // Auto-logout on session expiry
    useEffect(() => {
        if (state.sessionExpiry) {
            const timeUntilExpiry = state.sessionExpiry - Date.now()
            if (timeUntilExpiry > 0) {
                const timer = setTimeout(() => {
                    toast({
                        title: "Session abgelaufen",
                        description: "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
                        variant: "destructive",
                    })
                    logout()
                }, timeUntilExpiry)

                return () => clearTimeout(timer)
            }
        }
    }, [state.sessionExpiry, toast])

    const login = useCallback(
        async (email: string, password: string) => {
            dispatch({ type: "LOGIN_START" })
            try {
                const response = await authAPI.login(email, password)
                const sessionExpiry = Date.now() + response.expiresIn

                // Store in localStorage
                localStorage.setItem("auth-token", response.token)
                localStorage.setItem("session-expiry", sessionExpiry.toString())
                localStorage.setItem("user-data", JSON.stringify(response.user))

                dispatch({ type: "LOGIN_SUCCESS", payload: { user: response.user, sessionExpiry } })

                toast({
                    title: "Anmeldung erfolgreich",
                    description: `Willkommen zurück, ${response.user.name}!`,
                })

                router.push("/")
            } catch (error) {
                const message = error instanceof Error ? error.message : "Anmeldung fehlgeschlagen"
                dispatch({ type: "LOGIN_FAILURE", payload: message })
                toast({
                    title: "Anmeldung fehlgeschlagen",
                    description: message,
                    variant: "destructive",
                })
            }
        },
        [router, toast],
    )

    const register = useCallback(
        async (userData: RegisterData) => {
            dispatch({ type: "SET_LOADING", payload: true })
            try {
                const response = await authAPI.register(userData)
                const sessionExpiry = Date.now() + response.expiresIn

                localStorage.setItem("auth-token", response.token)
                localStorage.setItem("session-expiry", sessionExpiry.toString())
                localStorage.setItem("user-data", JSON.stringify(response.user))

                dispatch({ type: "LOGIN_SUCCESS", payload: { user: response.user, sessionExpiry } })

                toast({
                    title: "Registrierung erfolgreich",
                    description: `Willkommen, ${response.user.name}!`,
                })

                router.push("/")
            } catch (error) {
                const message = error instanceof Error ? error.message : "Registrierung fehlgeschlagen"
                dispatch({ type: "SET_ERROR", payload: message })
                toast({
                    title: "Registrierung fehlgeschlagen",
                    description: message,
                    variant: "destructive",
                })
            }
        },
        [router, toast],
    )

    const logout = useCallback(() => {
        localStorage.removeItem("auth-token")
        localStorage.removeItem("session-expiry")
        localStorage.removeItem("user-data")
        dispatch({ type: "LOGOUT" })
        router.push("/auth/login")
    }, [router])

    const resetPassword = useCallback(
        async (email: string) => {
            try {
                await authAPI.resetPassword(email)
                toast({
                    title: "Passwort-Reset gesendet",
                    description: "Überprüfen Sie Ihre E-Mail für weitere Anweisungen.",
                })
            } catch (error) {
                const message = error instanceof Error ? error.message : "Passwort-Reset fehlgeschlagen"
                toast({
                    title: "Fehler",
                    description: message,
                    variant: "destructive",
                })
            }
        },
        [toast],
    )

    const updateProfile = useCallback(
        async (data: Partial<User>) => {
            if (!state.user) return

            try {
                const updatedUser = await authAPI.updateProfile(state.user.id, data)
                dispatch({ type: "UPDATE_USER", payload: updatedUser })
                localStorage.setItem("user-data", JSON.stringify({ ...state.user, ...updatedUser }))

                toast({
                    title: "Profil aktualisiert",
                    description: "Ihre Profildaten wurden erfolgreich gespeichert.",
                })
            } catch (error) {
                const message = error instanceof Error ? error.message : "Profil-Update fehlgeschlagen"
                toast({
                    title: "Fehler",
                    description: message,
                    variant: "destructive",
                })
            }
        },
        [state.user, toast],
    )

    const refreshSession = useCallback(async () => {
        try {
            const response = await authAPI.refreshToken()
            const sessionExpiry = Date.now() + response.expiresIn

            localStorage.setItem("auth-token", response.token)
            localStorage.setItem("session-expiry", sessionExpiry.toString())

            dispatch({ type: "REFRESH_SESSION", payload: sessionExpiry })
        } catch (error) {
            logout()
        }
    }, [logout])

    const hasPermission = useCallback(
        (permission: string): boolean => {
            if (!state.user) return false
            return state.user.permissions.includes(permission) || state.user.permissions.includes("read:all")
        },
        [state.user],
    )

    const hasRole = useCallback(
        (role: string | string[]): boolean => {
            if (!state.user) return false
            const roles = Array.isArray(role) ? role : [role]
            return roles.includes(state.user.role)
        },
        [state.user],
    )

    const value: AuthContextType = {
        state,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        refreshSession,
        hasPermission,
        hasRole,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
