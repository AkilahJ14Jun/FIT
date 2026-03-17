import apiClient from './api'
import { Vehicle } from '../types'

export interface CreateVehicleDto {
  vehicleNumber: string
  type: string
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}

const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get('/vehicles')
    return response.data
  },

  getById: async (id: number): Promise<Vehicle> => {
    const response = await apiClient.get(`/vehicles/${id}`)
    return response.data
  },

  create: async (data: CreateVehicleDto): Promise<Vehicle> => {
    const response = await apiClient.post('/vehicles', data)
    return response.data
  },

  update: async (id: number, data: UpdateVehicleDto): Promise<Vehicle> => {
    const response = await apiClient.put(`/vehicles/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`)
  },

  getUsageReport: async (id: number): Promise<unknown> => {
    const response = await apiClient.get(`/vehicles/${id}/usage`)
    return response.data
  },
}

export default vehicleService
