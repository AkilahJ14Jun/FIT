import apiClient from './api'
import { BoxType } from '../types'

export interface CreateBoxTypeDto {
  capacity: number
  description: string
}

export interface UpdateBoxTypeDto extends Partial<CreateBoxTypeDto> {}

const boxTypeService = {
  getAll: async (): Promise<BoxType[]> => {
    const response = await apiClient.get('/box-types')
    return response.data
  },

  getById: async (id: number): Promise<BoxType> => {
    const response = await apiClient.get(`/box-types/${id}`)
    return response.data
  },

  create: async (data: CreateBoxTypeDto): Promise<BoxType> => {
    const response = await apiClient.post('/box-types', data)
    return response.data
  },

  update: async (id: number, data: UpdateBoxTypeDto): Promise<BoxType> => {
    const response = await apiClient.put(`/box-types/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/box-types/${id}`)
  },
}

export default boxTypeService
