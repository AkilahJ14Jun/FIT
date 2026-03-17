import { create } from 'zustand'
import { Customer, BoxType, Driver, Vehicle, ExternalSource } from '../types'

interface AppState {
  // Data caches
  customers: Customer[]
  boxTypes: BoxType[]
  drivers: Driver[]
  vehicles: Vehicle[]
  externalSources: ExternalSource[]

  // Loading states
  isLoadingCustomers: boolean
  isLoadingBoxTypes: boolean
  isLoadingDrivers: boolean
  isLoadingVehicles: boolean
  isLoadingExternalSources: boolean

  // Error states
  customersError: string | null
  boxTypesError: string | null
  driversError: string | null
  vehiclesError: string | null
  externalSourcesError: string | null

  // Actions
  setCustomers: (customers: Customer[]) => void
  setBoxTypes: (boxTypes: BoxType[]) => void
  setDrivers: (drivers: Driver[]) => void
  setVehicles: (vehicles: Vehicle[]) => void
  setExternalSources: (externalSources: ExternalSource[]) => void

  setIsLoadingCustomers: (loading: boolean) => void
  setIsLoadingBoxTypes: (loading: boolean) => void
  setIsLoadingDrivers: (loading: boolean) => void
  setIsLoadingVehicles: (loading: boolean) => void
  setIsLoadingExternalSources: (loading: boolean) => void

  setCustomersError: (error: string | null) => void
  setBoxTypesError: (error: string | null) => void
  setDriversError: (error: string | null) => void
  setVehiclesError: (error: string | null) => void
  setExternalSourcesError: (error: string | null) => void

  // UI state
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>(set => ({
  // Initial data states
  customers: [],
  boxTypes: [],
  drivers: [],
  vehicles: [],
  externalSources: [],

  // Initial loading states
  isLoadingCustomers: false,
  isLoadingBoxTypes: false,
  isLoadingDrivers: false,
  isLoadingVehicles: false,
  isLoadingExternalSources: false,

  // Initial error states
  customersError: null,
  boxTypesError: null,
  driversError: null,
  vehiclesError: null,
  externalSourcesError: null,

  // Data actions
  setCustomers: customers => set({ customers }),
  setBoxTypes: boxTypes => set({ boxTypes }),
  setDrivers: drivers => set({ drivers }),
  setVehicles: vehicles => set({ vehicles }),
  setExternalSources: externalSources => set({ externalSources }),

  // Loading actions
  setIsLoadingCustomers: isLoadingCustomers => set({ isLoadingCustomers }),
  setIsLoadingBoxTypes: isLoadingBoxTypes => set({ isLoadingBoxTypes }),
  setIsLoadingDrivers: isLoadingDrivers => set({ isLoadingDrivers }),
  setIsLoadingVehicles: isLoadingVehicles => set({ isLoadingVehicles }),
  setIsLoadingExternalSources: isLoadingExternalSources => set({ isLoadingExternalSources }),

  // Error actions
  setCustomersError: customersError => set({ customersError }),
  setBoxTypesError: boxTypesError => set({ boxTypesError }),
  setDriversError: driversError => set({ driversError }),
  setVehiclesError: vehiclesError => set({ vehiclesError }),
  setExternalSourcesError: externalSourcesError => set({ externalSourcesError }),

  // UI state
  sidebarOpen: false,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: sidebarOpen => set({ sidebarOpen }),
}))
