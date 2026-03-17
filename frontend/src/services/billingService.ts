import apiClient from './api'
import { Bill } from '../types'

export interface CreateBillDto {
  customerId: number
  deliveryIds: number[]
  billDate: string
}

export interface BillPreviewData {
  billNumber: string
  customerName: string
  shopName: string
  billDate: string
  deliveries: {
    date: string
    description: string
    quantitySent: number
    quantityReturned: number
    balance: number
  }[]
  totalBoxes: number
}

const billingService = {
  getAll: async (): Promise<Bill[]> => {
    const response = await apiClient.get('/bills')
    return response.data
  },

  getById: async (id: number): Promise<Bill> => {
    const response = await apiClient.get(`/bills/${id}`)
    return response.data
  },

  getByCustomer: async (customerId: number): Promise<Bill[]> => {
    const response = await apiClient.get(`/bills/customer/${customerId}`)
    return response.data
  },

  createSingle: async (deliveryId: number): Promise<Bill> => {
    const response = await apiClient.post('/bills/single', { deliveryId })
    return response.data
  },

  createConsolidated: async (data: CreateBillDto): Promise<Bill> => {
    const response = await apiClient.post('/bills/consolidated', data)
    return response.data
  },

  preview: async (deliveryIds: number[]): Promise<BillPreviewData> => {
    const response = await apiClient.post('/bills/preview', { deliveryIds })
    return response.data
  },

  downloadPdf: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/bills/${id}/pdf`, { responseType: 'blob' })
    return response.data
  },

  shareWhatsApp: async (id: number, phoneNumber: string): Promise<void> => {
    await apiClient.post(`/bills/${id}/share`, { phoneNumber })
  },

  getNextBillNumber: async (): Promise<string> => {
    const response = await apiClient.get('/bills/next-number')
    return response.data
  },
}

export default billingService
