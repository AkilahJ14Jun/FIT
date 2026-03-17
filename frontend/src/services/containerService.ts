import apiClient from './api'
import { Container } from '../types'

export interface CreateContainerDto {
  purchaseDate: string
  quantity: number
  supplier: string
  description?: string
}

export interface UpdateContainerDto extends Partial<CreateContainerDto> {}

const containerService = {
  getAll: async (): Promise<Container[]> => {
    const response = await apiClient.get('/containers')
    return response.data
  },

  getById: async (id: number): Promise<Container> => {
    const response = await apiClient.get(`/containers/${id}`)
    return response.data
  },

  create: async (data: CreateContainerDto): Promise<Container> => {
    const response = await apiClient.post('/containers', data)
    return response.data
  },

  update: async (id: number, data: UpdateContainerDto): Promise<Container> => {
    const response = await apiClient.put(`/containers/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/containers/${id}`)
  },
}

export default containerService
