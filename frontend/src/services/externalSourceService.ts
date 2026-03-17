import apiClient from './api'
import { ExternalSource } from '../types'

export interface CreateExternalSourceDto {
  name: string
  contactDetails: string
}

export interface UpdateExternalSourceDto extends Partial<CreateExternalSourceDto> {}

const externalSourceService = {
  getAll: async (): Promise<ExternalSource[]> => {
    const response = await apiClient.get('/external-sources')
    return response.data
  },

  getById: async (id: number): Promise<ExternalSource> => {
    const response = await apiClient.get(`/external-sources/${id}`)
    return response.data
  },

  create: async (data: CreateExternalSourceDto): Promise<ExternalSource> => {
    const response = await apiClient.post('/external-sources', data)
    return response.data
  },

  update: async (id: number, data: UpdateExternalSourceDto): Promise<ExternalSource> => {
    const response = await apiClient.put(`/external-sources/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/external-sources/${id}`)
  },

  getBalance: async (id: number): Promise<unknown> => {
    const response = await apiClient.get(`/external-sources/${id}/balance`)
    return response.data
  },
}

export default externalSourceService
