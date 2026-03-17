import apiClient from './api'

export interface CustomerDateRangeReportParams {
  customerId: number
  startDate: string
  endDate: string
}

export interface DailyDispatchReportParams {
  date: string
}

export interface InventoryReportParams {
  boxTypeId?: number
}

const reportService = {
  getCustomerDateRangeReport: async (params: CustomerDateRangeReportParams): Promise<unknown> => {
    const response = await apiClient.get('/reports/customer-date-range', { params })
    return response.data
  },

  getDailyDispatchReport: async (params: DailyDispatchReportParams): Promise<unknown> => {
    const response = await apiClient.get('/reports/daily-dispatch', { params })
    return response.data
  },

  getCustomerBalanceSummary: async (): Promise<unknown> => {
    const response = await apiClient.get('/reports/customer-balances')
    return response.data
  },

  getInventoryReport: async (params?: InventoryReportParams): Promise<unknown> => {
    const response = await apiClient.get('/reports/inventory', { params })
    return response.data
  },

  getInventoryMovementReport: async (startDate?: string, endDate?: string): Promise<unknown> => {
    const response = await apiClient.get('/reports/inventory-movement', {
      params: { startDate, endDate },
    })
    return response.data
  },

  exportToPdf: async (reportType: string, params: Record<string, unknown>): Promise<Blob> => {
    const response = await apiClient.get(`/reports/${reportType}/export`, {
      params,
      responseType: 'blob',
    })
    return response.data
  },
}

export default reportService
