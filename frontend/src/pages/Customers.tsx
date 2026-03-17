import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Table, Modal, Card } from '../components'
import { Customer } from '../types'
import { customerService } from '../services'

export const Customers: React.FC = () => {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await customerService.getAll({ limit: 1000 })
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobileNumber.includes(searchQuery)
  )

  const handleDelete = async () => {
    if (!customerToDelete) return
    try {
      await customerService.delete(customerToDelete.id)
      setDeleteModalOpen(false)
      setCustomerToDelete(null)
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Failed to delete customer. They may have existing deliveries.')
    }
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'shopName', header: 'Shop Name' },
    { key: 'mobileNumber', header: 'Mobile' },
    { key: 'address', header: 'Address' },
    {
      key: 'actions',
      header: 'Actions',
      render: (customer: Customer) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/customers/${customer.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setCustomerToDelete(customer)
              setDeleteModalOpen(true)
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full sm:w-96"
        />
        <Button onClick={() => navigate('/customers/new')}>+ Add Customer</Button>
      </div>

      <Card>
        <Table
          data={filteredCustomers}
          columns={columns}
          keyExtractor={item => item.id}
          isLoading={isLoading}
          emptyMessage="No customers found"
        />
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setCustomerToDelete(null)
        }}
        title="Delete Customer"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{' '}
            <strong>{customerToDelete?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false)
                setCustomerToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
