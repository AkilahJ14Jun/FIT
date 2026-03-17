import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Table, Card, Input, Select } from '../components'
import { Delivery, Customer, BoxType, Driver, Vehicle } from '../types'
import { deliveryService, customerService, boxTypeService, driverService, vehicleService } from '../services'

export const Deliveries: React.FC = () => {
  const navigate = useNavigate()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    customerId: '',
    startDate: '',
    endDate: '',
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [deliveriesRes, customersRes, boxTypesRes, driversRes, vehiclesRes] = await Promise.all([
        deliveryService.getAll({ limit: 100 }),
        customerService.getAll({ limit: 1000 }),
        boxTypeService.getAll(),
        driverService.getAll(),
        vehicleService.getAll(),
      ])
      setDeliveries(deliveriesRes.data)
      setCustomers(customersRes.data)
      setBoxTypes(boxTypesRes)
      setDrivers(driversRes)
      setVehicles(vehiclesRes)
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getCustomerName = (id: number) => {
    return customers.find(c => c.id === id)?.name || 'Unknown'
  }

  const getBoxTypeDescription = (id: number) => {
    return boxTypes.find(b => b.id === id)?.description || 'Unknown'
  }

  const getDriverName = (id?: number) => {
    return id ? drivers.find(d => d.id === id)?.name || '-' : '-'
  }

  const getVehicleNumber = (id?: number) => {
    return id ? vehicles.find(v => v.id === id)?.vehicleNumber || '-' : '-'
  }

  const filteredDeliveries = deliveries.filter(delivery => {
    if (filters.customerId && delivery.customerId !== Number(filters.customerId)) return false
    if (filters.startDate && new Date(delivery.date) < new Date(filters.startDate)) return false
    if (filters.endDate && new Date(delivery.date) > new Date(filters.endDate)) return false
    return true
  })

  const columns = [
    { key: 'billNumber', header: 'Bill #' },
    { key: 'date', header: 'Date' },
    {
      key: 'customer',
      header: 'Customer',
      render: (delivery: Delivery) => getCustomerName(delivery.customerId),
    },
    {
      key: 'boxType',
      header: 'Box Type',
      render: (delivery: Delivery) => getBoxTypeDescription(delivery.boxTypeId),
    },
    { key: 'quantitySent', header: 'Sent' },
    { key: 'quantityReturned', header: 'Returned' },
    { key: 'balance', header: 'Balance' },
    {
      key: 'driver',
      header: 'Driver',
      render: (delivery: Delivery) => getDriverName(delivery.driverId),
    },
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (delivery: Delivery) => getVehicleNumber(delivery.vehicleId),
    },
  ]

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }))

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Select
            options={customerOptions}
            value={filters.customerId}
            onChange={e => setFilters({ ...filters, customerId: e.target.value })}
            className="w-full sm:w-48"
          />
          <Input
            type="date"
            value={filters.startDate}
            onChange={e => setFilters({ ...filters, startDate: e.target.value })}
            className="w-full sm:w-40"
          />
          <Input
            type="date"
            value={filters.endDate}
            onChange={e => setFilters({ ...filters, endDate: e.target.value })}
            className="w-full sm:w-40"
          />
        </div>

        <Button onClick={() => navigate('/deliveries/new')}>+ New Delivery</Button>
      </div>

      <Card>
        <Table
          data={filteredDeliveries}
          columns={columns}
          keyExtractor={item => item.id}
          isLoading={isLoading}
          emptyMessage="No deliveries found"
        />
      </Card>
    </div>
  )
}
