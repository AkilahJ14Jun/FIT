import apiClient from './api'
import { Customer, PaginatedResponse } from '../types'

export interface CreateCustomerDto {
  name: string
  shopName: string
  address: string
  mobileNumber: string
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export interface CustomerQueryParams {
  page?: number
  limit?: number
  search?: string
}

const customerService = {
  getAll: async (params?: CustomerQueryParams): Promise<PaginatedResponse<Customer>> => {
    const response = await apiClient.get('/customers', { params })
    return response.data
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await apiClient.get(`/customers/${id}`)
    return response.data
  },

  create: async (data: CreateCustomerDto): Promise<Customer> => {
    const response = await apiClient.post('/customers', data)
    return response.data
  },

  update: async (id: number, data: UpdateCustomerDto): Promise<Customer> => {
    const response = await apiClient.put(`/customers/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/customers/${id}`)
  },

  search: async (query: string): Promise<Customer[]> => {
    const response = await apiClient.get('/customers/search', { params: { query } })
    return response.data
  },
}

export default customerService
