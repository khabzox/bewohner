"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import { propertyReducer, initialState, type PropertyState, type PropertyAction } from "@/lib/store/property-store"
import { useToast } from "@/hooks/use-toast"

interface PropertyContextType {
  state: PropertyState
  dispatch: React.Dispatch<PropertyAction>
  actions: {
    updateResident: (data: any) => void
    updateInspection: (data: any) => void
    addMaintenanceOrder: (order: any) => void
    updateMaintenanceOrder: (id: string, updates: any) => void
    deleteMaintenanceOrder: (id: string) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
  }
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(propertyReducer, initialState)
  const { toast } = useToast()

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      try {
        localStorage.setItem("property-dashboard-data", JSON.stringify(state))
      } catch (error) {
        console.error("Failed to save data:", error)
      }
    }

    const timeoutId = setTimeout(saveData, 1000)
    return () => clearTimeout(timeoutId)
  }, [state])

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("property-dashboard-data")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: "LOAD_DATA", payload: parsedData })
      }
    } catch (error) {
      console.error("Failed to load saved data:", error)
    }
  }, [])

  const actions = {
    updateResident: useCallback(
      (data: any) => {
        dispatch({ type: "UPDATE_RESIDENT", payload: data })
        toast({
          title: "Bewohner aktualisiert",
          description: "Die Bewohnerdaten wurden erfolgreich gespeichert.",
        })
      },
      [toast],
    ),

    updateInspection: useCallback(
      (data: any) => {
        dispatch({ type: "UPDATE_INSPECTION", payload: data })
        toast({
          title: "Inspektion aktualisiert",
          description: "Die Inspektionsdaten wurden erfolgreich gespeichert.",
        })
      },
      [toast],
    ),

    addMaintenanceOrder: useCallback(
      (order: any) => {
        dispatch({ type: "ADD_MAINTENANCE_ORDER", payload: order })
        toast({
          title: "Wartungsauftrag erstellt",
          description: "Der neue Wartungsauftrag wurde erfolgreich hinzugefügt.",
        })
      },
      [toast],
    ),

    updateMaintenanceOrder: useCallback(
      (id: string, updates: any) => {
        dispatch({ type: "UPDATE_MAINTENANCE_ORDER", payload: { id, updates } })
        toast({
          title: "Wartungsauftrag aktualisiert",
          description: "Der Wartungsauftrag wurde erfolgreich aktualisiert.",
        })
      },
      [toast],
    ),

    deleteMaintenanceOrder: useCallback(
      (id: string) => {
        dispatch({ type: "DELETE_MAINTENANCE_ORDER", payload: id })
        toast({
          title: "Wartungsauftrag gelöscht",
          description: "Der Wartungsauftrag wurde erfolgreich entfernt.",
          variant: "destructive",
        })
      },
      [toast],
    ),

    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: "SET_LOADING", payload: loading })
    }, []),

    setError: useCallback(
      (error: string | null) => {
        dispatch({ type: "SET_ERROR", payload: error })
        if (error) {
          toast({
            title: "Fehler",
            description: error,
            variant: "destructive",
          })
        }
      },
      [toast],
    ),
  }

  return <PropertyContext.Provider value={{ state, dispatch, actions }}>{children}</PropertyContext.Provider>
}

export function useProperty() {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error("useProperty must be used within a PropertyProvider")
  }
  return context
}
