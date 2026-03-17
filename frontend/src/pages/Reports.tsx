import React, { useState } from 'react'
import { Button, Card, Input, Select, Table } from '../components'
import { Customer } from '../types'
import { customerService, reportService } from '../services'

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<
    'customerDateRange' | 'dailyDispatch' | 'customerBalances' | 'inventory'
  >('customerDateRange')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<unknown>(null)

  const [filters, setFilters] = useState({
    customerId: '',
    date: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
  })

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll({ limit: 1000 })
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const generateReport = async () => {
    setIsLoading(true)
    try {
      let data
      switch (reportType) {
        case 'customerDateRange':
          if (!filters.customerId || !filters.startDate || !filters.endDate) {
            alert('Please select customer and date range')
            return
          }
          data = await reportService.getCustomerDateRangeReport({
            customerId: Number(filters.customerId),
            startDate: filters.startDate,
            endDate: filters.endDate,
          })
          break
        case 'dailyDispatch':
          data = await reportService.getDailyDispatchReport({ date: filters.date })
          break
        case 'customerBalances':
          data = await reportService.getCustomerBalanceSummary()
          break
        case 'inventory':
          data = await reportService.getInventoryReport()
          break
      }
      setReportData(data)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }))

  return (
    <div className="space-y-4">
      <Card title="Generate Report">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'customerDateRange', label: 'Customer Date Range' },
                { key: 'dailyDispatch', label: 'Daily Dispatch' },
                { key: 'customerBalances', label: 'Customer Balances' },
                { key: 'inventory', label: 'Inventory' },
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => {
                    setReportType(type.key as typeof reportType)
                    if (type.key === 'customerDateRange') fetchCustomers()
                  }}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    reportType === type.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {reportType === 'customerDateRange' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Customer"
                options={customerOptions}
                value={filters.customerId}
                onChange={e => setFilters({ ...filters, customerId: e.target.value })}
              />
              <Input
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          )}

          {reportType === 'dailyDispatch' && (
            <Input
              label="Date"
              type="date"
              value={filters.date}
              onChange={e => setFilters({ ...filters, date: e.target.value })}
            />
          )}

          <Button onClick={generateReport} isLoading={isLoading}>
            Generate Report
          </Button>
        </div>
      </Card>

      {reportData && (
        <Card title="Report Results">
          <pre className="text-sm overflow-auto">{JSON.stringify(reportData, null, 2)}</pre>
        </Card>
      )}
    </div>
  )
}
