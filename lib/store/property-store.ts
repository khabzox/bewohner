export interface Resident {
  id: string
  name: string
  room: string
  status: "moving-in" | "moving-out" | "occupied" | "vacant"
  moveInDate: string
  moveOutDate: string
  inspector: string
  nachfolger?: string
  schlüsselnummer: string
}

export interface FurnitureItem {
  id: string
  name: string
  quantity: number
  condition: "vorhanden" | "defekt" | "notiz"
  category: string
  hasPhoto: boolean
  notes?: string
}

export interface RoomCondition {
  condition: "gut" | "okay" | "schlecht"
  score: number
  notes: string
  trend: "up" | "down" | "stable"
}

export interface MaintenanceOrder {
  id: string
  type: string
  count: number
  avgDays: number
  status: "pending" | "progress" | "completed"
  priority: "high" | "medium" | "low"
  date: string
  color: string
  assignedTo?: string
  cost?: number
  description?: string
}

export interface PropertyState {
  resident: Resident
  inspection: {
    furniture: { total: number; inspected: number; defective: number }
    rooms: Record<string, RoomCondition>
    overallScore: number
    completionRate: number
    rgtItems: FurnitureItem[]
  }
  analytics: {
    occupancy: {
      belegt: number
      nichtNutzbar: number
      frei: number
      sibo: number
      total: number
    }
    orders: MaintenanceOrder[]
    bestellungen: {
      total: number
      categories: Array<{ name: string; count: number }>
    }
    bewohner: {
      mehrpersonenhaushalten: number
      alleinstehend: number
      ehepaareKinder: number
      familieMitKindern: number
      paargemeinschaften: number
    }
    gebäude: {
      score: number
      trend: "up" | "down" | "stable"
    }
  }
  ui: {
    loading: boolean
    error: string | null
    activeTab: string
    searchQuery: string
    selectedRoom: string | null
  }
}

export type PropertyAction =
  | { type: "UPDATE_RESIDENT"; payload: Partial<Resident> }
  | { type: "UPDATE_INSPECTION"; payload: any }
  | { type: "ADD_MAINTENANCE_ORDER"; payload: MaintenanceOrder }
  | { type: "UPDATE_MAINTENANCE_ORDER"; payload: { id: string; updates: Partial<MaintenanceOrder> } }
  | { type: "DELETE_MAINTENANCE_ORDER"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_ROOM"; payload: string | null }
  | { type: "LOAD_DATA"; payload: Partial<PropertyState> }

export const initialState: PropertyState = {
  resident: {
    id: "1",
    name: "Max Mustermann",
    room: "WB 2 | Raum 0106",
    status: "moving-out",
    moveInDate: "2018-11-04",
    moveOutDate: "2018-09-04",
    inspector: "Sarah Schmidt",
    nachfolger: "",
    schlüsselnummer: "A-0106-001",
  },
  inspection: {
    furniture: { total: 20, inspected: 15, defective: 2 },
    rooms: {
      boden: { condition: "okay", score: 7.5, notes: "Minor scratches", trend: "up" },
      bad: { condition: "gut", score: 9.2, notes: "Recently renovated", trend: "up" },
      mobiliar: { condition: "okay", score: 6.8, notes: "Normal wear", trend: "down" },
      wände: { condition: "schlecht", score: 4.2, notes: "Needs painting", trend: "down" },
    },
    overallScore: 2.7,
    completionRate: 75,
    rgtItems: [
      { id: "1", name: "Bett", quantity: 1, condition: "vorhanden", category: "Schlafzimmer", hasPhoto: true },
      { id: "2", name: "Schreibtisch", quantity: 1, condition: "defekt", category: "Schlafzimmer", hasPhoto: false },
      { id: "3", name: "Stuhl", quantity: 2, condition: "vorhanden", category: "Schlafzimmer", hasPhoto: true },
      { id: "4", name: "Kühlschrank", quantity: 1, condition: "vorhanden", category: "Küche", hasPhoto: true },
      { id: "5", name: "Herd", quantity: 1, condition: "notiz", category: "Küche", hasPhoto: false },
    ],
  },
  analytics: {
    occupancy: {
      belegt: 439,
      nichtNutzbar: 311,
      frei: 411,
      sibo: 308,
      total: 1469,
    },
    orders: [
      {
        id: "1",
        type: "Fenster",
        count: 48,
        avgDays: 7.11,
        status: "pending",
        priority: "high",
        date: "2024-01-15",
        color: "teal",
      },
      {
        id: "2",
        type: "Boden",
        count: 7,
        avgDays: 9.99,
        status: "progress",
        priority: "medium",
        date: "2024-01-14",
        color: "amber",
      },
      {
        id: "3",
        type: "Maler",
        count: 25,
        avgDays: 12.21,
        status: "completed",
        priority: "high",
        date: "2024-01-13",
        color: "red",
      },
      {
        id: "4",
        type: "Türen",
        count: 25,
        avgDays: 6.21,
        status: "pending",
        priority: "low",
        date: "2024-01-12",
        color: "green",
      },
    ],
    bestellungen: {
      total: 967,
      categories: [
        { name: "Kategorie 1", count: 7 },
        { name: "Kategorie 2", count: 8 },
        { name: "Kategorie 3", count: 3 },
      ],
    },
    bewohner: {
      mehrpersonenhaushalten: 20,
      alleinstehend: 23,
      ehepaareKinder: 36,
      familieMitKindern: 49,
      paargemeinschaften: 5,
    },
    gebäude: {
      score: 27.5,
      trend: "up",
    },
  },
  ui: {
    loading: false,
    error: null,
    activeTab: "übersicht",
    searchQuery: "",
    selectedRoom: null,
  },
}

export function propertyReducer(state: PropertyState, action: PropertyAction): PropertyState {
  switch (action.type) {
    case "UPDATE_RESIDENT":
      return {
        ...state,
        resident: { ...state.resident, ...action.payload },
      }

    case "UPDATE_INSPECTION":
      return {
        ...state,
        inspection: { ...state.inspection, ...action.payload },
      }

    case "ADD_MAINTENANCE_ORDER":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          orders: [...state.analytics.orders, action.payload],
        },
      }

    case "UPDATE_MAINTENANCE_ORDER":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          orders: state.analytics.orders.map((order) =>
            order.id === action.payload.id ? { ...order, ...action.payload.updates } : order,
          ),
        },
      }

    case "DELETE_MAINTENANCE_ORDER":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          orders: state.analytics.orders.filter((order) => order.id !== action.payload),
        },
      }

    case "SET_LOADING":
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload },
      }

    case "SET_ERROR":
      return {
        ...state,
        ui: { ...state.ui, error: action.payload },
      }

    case "SET_ACTIVE_TAB":
      return {
        ...state,
        ui: { ...state.ui, activeTab: action.payload },
      }

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        ui: { ...state.ui, searchQuery: action.payload },
      }

    case "SET_SELECTED_ROOM":
      return {
        ...state,
        ui: { ...state.ui, selectedRoom: action.payload },
      }

    case "LOAD_DATA":
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}
