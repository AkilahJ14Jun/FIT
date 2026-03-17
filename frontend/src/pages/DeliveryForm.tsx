import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Select, Card } from '../components'
import { Customer, BoxType, Driver, Vehicle, ExternalSource } from '../types'
import {
  customerService,
  boxTypeService,
  driverService,
  vehicleService,
  externalSourceService,
  deliveryService,
  billingService,
} from '../services'

export const DeliveryForm: React.FC = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [externalSources, setExternalSources] = useState<ExternalSource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [nextBillNumber, setNextBillNumber] = useState('')

  const [formData, setFormData] = useState({
    billNumber: '',
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    boxTypeId: '',
    quantitySent: '',
    quantityReturned: '0',
    driverId: '',
    vehicleId: '',
    externalSourceId: '',
    description: '',
    isOpeningBalance: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [customersRes, boxTypesRes, driversRes, vehiclesRes, externalSourcesRes, billNumRes] =
          await Promise.all([
            customerService.getAll({ limit: 1000 }),
            boxTypeService.getAll(),
            driverService.getAll(),
            vehicleService.getAll(),
            externalSourceService.getAll(),
            billingService.getNextBillNumber(),
          ])
        setCustomers(customersRes.data)
        setBoxTypes(boxTypesRes)
        setDrivers(driversRes)
        setVehicles(vehiclesRes)
        setExternalSources(externalSourcesRes)
        setNextBillNumber(billNumRes)
        setFormData(prev => ({ ...prev, billNumber: billNumRes }))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.billNumber.trim()) newErrors.billNumber = 'Bill number is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.customerId) newErrors.customerId = 'Customer is required'
    if (!formData.boxTypeId) newErrors.boxTypeId = 'Box type is required'
    if (!formData.quantitySent || Number(formData.quantitySent) <= 0) {
      newErrors.quantitySent = 'Valid quantity is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    try {
      await deliveryService.create({
        billNumber: formData.billNumber,
        date: formData.date,
        customerId: Number(formData.customerId),
        boxTypeId: Number(formData.boxTypeId),
        quantitySent: Number(formData.quantitySent),
        quantityReturned: Number(formData.quantityReturned),
        driverId: formData.driverId ? Number(formData.driverId) : undefined,
        vehicleId: formData.vehicleId ? Number(formData.vehicleId) : undefined,
        externalSourceId: formData.externalSourceId
          ? Number(formData.externalSourceId)
          : undefined,
        description: formData.description,
        isOpeningBalance: formData.isOpeningBalance,
      })
      navigate('/deliveries')
    } catch (error) {
      console.error('Error creating delivery:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }))
  const boxTypeOptions = boxTypes.map(b => ({
    value: b.id,
    label: `${b.description} (${b.capacity}kg)`,
  }))
  const driverOptions = drivers.map(d => ({ value: d.id, label: d.name }))
  const vehicleOptions = vehicles.map(v => ({ value: v.id, label: v.vehicleNumber }))
  const externalSourceOptions = externalSources.map(es => ({
    value: es.id,
    label: es.name,
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Card title="New Delivery" subtitle="Create a new delivery dispatch">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bill Number"
            name="billNumber"
            value={formData.billNumber}
            onChange={handleChange}
            error={errors.billNumber}
            required
          />

          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
          />
        </div>

        <Select
          label="Customer"
          name="customerId"
          options={customerOptions}
          value={formData.customerId}
          onChange={handleChange}
          error={errors.customerId}
          required
        />

        <Select
          label="Box Type"
          name="boxTypeId"
          options={boxTypeOptions}
          value={formData.boxTypeId}
          onChange={handleChange}
          error={errors.boxTypeId}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Quantity Sent"
            name="quantitySent"
            type="number"
            value={formData.quantitySent}
            onChange={handleChange}
            error={errors.quantitySent}
            required
          />

          <Input
            label="Quantity Returned"
            name="quantityReturned"
            type="number"
            value={formData.quantityReturned}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Driver (Optional)"
            name="driverId"
            options={driverOptions}
            value={formData.driverId}
            onChange={handleChange}
          />

          <Select
            label="Vehicle (Optional)"
            name="vehicleId"
            options={vehicleOptions}
            value={formData.vehicleId}
            onChange={handleChange}
          />
        </div>

        <Select
          label="External Source (Optional)"
          name="externalSourceId"
          options={externalSourceOptions}
          value={formData.externalSourceId}
          onChange={handleChange}
        />

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isOpeningBalance"
            name="isOpeningBalance"
            checked={formData.isOpeningBalance}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isOpeningBalance" className="ml-2 text-sm text-gray-700">
            This is an opening balance entry
          </label>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" isLoading={isSaving}>Create Delivery</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/deliveries')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
