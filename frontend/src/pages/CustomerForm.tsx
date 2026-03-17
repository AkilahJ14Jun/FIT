import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../components'
import { customerService } from '../services'

export const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    address: '',
    mobileNumber: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isEditMode && id) {
      const fetchCustomer = async () => {
        setIsLoading(true)
        try {
          const customer = await customerService.getById(Number(id))
          setFormData({
            name: customer.name,
            shopName: customer.shopName,
            address: customer.address,
            mobileNumber: customer.mobileNumber,
          })
        } catch (error) {
          console.error('Error fetching customer:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchCustomer()
    }
  }, [id, isEditMode])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required'
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    try {
      if (isEditMode && id) {
        await customerService.update(Number(id), formData)
      } else {
        await customerService.create(formData)
      }
      navigate('/customers')
    } catch (error: unknown) {
      console.error('Error saving customer:', error)
      const apiError = error as { message?: string }
      if (apiError.message?.includes('mobile')) {
        setErrors({ mobileNumber: 'This mobile number is already registered' })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Card
      title={isEditMode ? 'Edit Customer' : 'Add New Customer'}
      subtitle={isEditMode ? 'Update customer details' : 'Create a new customer record'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Shop Name"
          name="shopName"
          value={formData.shopName}
          onChange={handleChange}
          error={errors.shopName}
          required
        />

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />

        <Input
          label="Mobile Number"
          name="mobileNumber"
          type="tel"
          value={formData.mobileNumber}
          onChange={handleChange}
          error={errors.mobileNumber}
          helperText="Enter 10-digit mobile number"
          required
        />

        <div className="flex space-x-4 pt-4">
          <Button type="submit" isLoading={isSaving}>
            {isEditMode ? 'Update' : 'Create'} Customer
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/customers')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
