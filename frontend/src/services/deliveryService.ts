import apiClient from './api'
import { Delivery, PaginatedResponse } from '../types'

export interface CreateDeliveryDto {
  billNumber: string
  date: string
  quantitySent: number
  quantityReturned: number
  description?: string
  customerId: number
  boxTypeId: number
  driverId?: number
  vehicleId?: number
  externalSourceId?: number
  isOpeningBalance?: boolean
}

export interface UpdateDeliveryDto extends Partial<CreateDeliveryDto> {}

export interface DeliveryQueryParams {
  page?: number
  limit?: number
  customerId?: number
  startDate?: string
  endDate?: string
}

const deliveryService = {
  getAll: async (params?: DeliveryQueryParams): Promise<PaginatedResponse<Delivery>> => {
    const response = await apiClient.get('/deliveries', { params })
    return response.data
  },

  getById: async (id: number): Promise<Delivery> => {
    const response = await apiClient.get(`/deliveries/${id}`)
    return response.data
  },

  create: async (data: CreateDeliveryDto): Promise<Delivery> => {
    const response = await apiClient.post('/deliveries', data)
    return response.data
  },

  update: async (id: number, data: UpdateDeliveryDto): Promise<Delivery> => {
    const response = await apiClient.put(`/deliveries/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/deliveries/${id}`)
  },

  recordReturn: async (id: number, quantityReturned: number): Promise<Delivery> => {
    const response = await apiClient.post(`/deliveries/${id}/return`, { quantityReturned })
    return response.data
  },

  getByCustomer: async (customerId: number): Promise<Delivery[]> => {
    const response = await apiClient.get(`/deliveries/customer/${customerId}`)
    return response.data
  },

  getByDate: async (date: string): Promise<Delivery[]> => {
    const response = await apiClient.get('/deliveries/by-date', { params: { date } })
    return response.data
  },
}

export default deliveryService
