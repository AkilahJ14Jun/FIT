import apiClient from './api'
import { Driver } from '../types'

export interface CreateDriverDto {
  name: string
  contactNumber: string
}

export interface UpdateDriverDto extends Partial<CreateDriverDto> {}

const driverService = {
  getAll: async (): Promise<Driver[]> => {
    const response = await apiClient.get('/drivers')
    return response.data
  },

  getById: async (id: number): Promise<Driver> => {
    const response = await apiClient.get(`/drivers/${id}`)
    return response.data
  },

  create: async (data: CreateDriverDto): Promise<Driver> => {
    const response = await apiClient.post('/drivers', data)
    return response.data
  },

  update: async (id: number, data: UpdateDriverDto): Promise<Driver> => {
    const response = await apiClient.put(`/drivers/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/drivers/${id}`)
  },

  getDeliveryHistory: async (id: number): Promise<unknown[]> => {
    const response = await apiClient.get(`/drivers/${id}/deliveries`)
    return response.data
  },
}

export default driverService
