import React, { useEffect } from 'react'
import { Card } from '../components'
import { useAppStore } from '../stores'
import { customerService, boxTypeService, deliveryService } from '../services'

export const Dashboard: React.FC = () => {
  const {
    customers,
    boxTypes,
    setCustomers,
    setBoxTypes,
    setIsLoadingCustomers,
    setIsLoadingBoxTypes,
  } = useAppStore()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCustomers(true)
      setIsLoadingBoxTypes(true)
      try {
        const [customersRes, boxTypesRes] = await Promise.all([
          customerService.getAll({ limit: 1000 }),
          boxTypeService.getAll(),
        ])
        setCustomers(customersRes.data)
        setBoxTypes(boxTypesRes)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoadingCustomers(false)
        setIsLoadingBoxTypes(false)
      }
    }

    fetchData()
  }, [setCustomers, setBoxTypes, setIsLoadingCustomers, setIsLoadingBoxTypes])

  const stats = [
    { label: 'Total Customers', value: customers.length, icon: '👥' },
    { label: 'Box Types', value: boxTypes.length, icon: '📦' },
    { label: "Today's Deliveries", value: '-', icon: '🚚' },
    { label: 'Pending Returns', value: '-', icon: '↩️' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <p className="text-gray-500">No recent activity to display.</p>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-2">
            <a
              href="#/customers/new"
              className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              + Add New Customer
            </a>
            <a
              href="#/deliveries/new"
              className="block p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              + Create Delivery
            </a>
            <a
              href="#/inventory/new"
              className="block p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              + Add Container
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
