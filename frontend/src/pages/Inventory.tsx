import React, { useEffect, useState } from 'react'
import { Button, Table, Card, Modal, Input } from '../components'
import { BoxType, Container } from '../types'
import { boxTypeService, containerService } from '../services'

export const Inventory: React.FC = () => {
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([])
  const [containers, setContainers] = useState<Container[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'boxTypes' | 'containers'>('boxTypes')

  // Box Type Modal
  const [boxTypeModalOpen, setBoxTypeModalOpen] = useState(false)
  const [boxTypeForm, setBoxTypeForm] = useState({ capacity: '', description: '' })

  // Container Modal
  const [containerModalOpen, setContainerModalOpen] = useState(false)
  const [containerForm, setContainerForm] = useState({
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: '',
    supplier: '',
    description: '',
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [boxTypesRes, containersRes] = await Promise.all([
        boxTypeService.getAll(),
        containerService.getAll(),
      ])
      setBoxTypes(boxTypesRes)
      setContainers(containersRes)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateBoxType = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await boxTypeService.create({
        capacity: Number(boxTypeForm.capacity),
        description: boxTypeForm.description,
      })
      setBoxTypeModalOpen(false)
      setBoxTypeForm({ capacity: '', description: '' })
      fetchData()
    } catch (error) {
      console.error('Error creating box type:', error)
    }
  }

  const handleCreateContainer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await containerService.create({
        purchaseDate: containerForm.purchaseDate,
        quantity: Number(containerForm.quantity),
        supplier: containerForm.supplier,
        description: containerForm.description,
      })
      setContainerModalOpen(false)
      setContainerForm({
        purchaseDate: new Date().toISOString().split('T')[0],
        quantity: '',
        supplier: '',
        description: '',
      })
      fetchData()
    } catch (error) {
      console.error('Error creating container:', error)
    }
  }

  const boxTypeColumns = [
    { key: 'capacity', header: 'Capacity (kg)' },
    { key: 'description', header: 'Description' },
  ]

  const containerColumns = [
    { key: 'purchaseDate', header: 'Purchase Date' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'supplier', header: 'Supplier' },
    { key: 'description', header: 'Description' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`pb-2 px-4 font-medium ${
            activeTab === 'boxTypes'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('boxTypes')}
        >
          Box Types
        </button>
        <button
          className={`pb-2 px-4 font-medium ${
            activeTab === 'containers'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('containers')}
        >
          Containers
        </button>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() =>
            activeTab === 'boxTypes'
              ? setBoxTypeModalOpen(true)
              : setContainerModalOpen(true)
          }
        >
          + Add {activeTab === 'boxTypes' ? 'Box Type' : 'Container'}
        </Button>
      </div>

      <Card>
        {activeTab === 'boxTypes' ? (
          <Table
            data={boxTypes}
            columns={boxTypeColumns}
            keyExtractor={item => item.id}
            isLoading={isLoading}
            emptyMessage="No box types found"
          />
        ) : (
          <Table
            data={containers}
            columns={containerColumns}
            keyExtractor={item => item.id}
            isLoading={isLoading}
            emptyMessage="No containers found"
          />
        )}
      </Card>

      {/* Box Type Modal */}
      <Modal
        isOpen={boxTypeModalOpen}
        onClose={() => setBoxTypeModalOpen(false)}
        title="Add Box Type"
        size="sm"
      >
        <form onSubmit={handleCreateBoxType} className="space-y-4">
          <Input
            label="Capacity (kg)"
            type="number"
            value={boxTypeForm.capacity}
            onChange={e => setBoxTypeForm({ ...boxTypeForm, capacity: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={boxTypeForm.description}
            onChange={e => setBoxTypeForm({ ...boxTypeForm, description: e.target.value })}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setBoxTypeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* Container Modal */}
      <Modal
        isOpen={containerModalOpen}
        onClose={() => setContainerModalOpen(false)}
        title="Add Container"
        size="sm"
      >
        <form onSubmit={handleCreateContainer} className="space-y-4">
          <Input
            label="Purchase Date"
            type="date"
            value={containerForm.purchaseDate}
            onChange={e => setContainerForm({ ...containerForm, purchaseDate: e.target.value })}
            required
          />
          <Input
            label="Quantity"
            type="number"
            value={containerForm.quantity}
            onChange={e => setContainerForm({ ...containerForm, quantity: e.target.value })}
            required
          />
          <Input
            label="Supplier"
            value={containerForm.supplier}
            onChange={e => setContainerForm({ ...containerForm, supplier: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={containerForm.description}
            onChange={e => setContainerForm({ ...containerForm, description: e.target.value })}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setContainerModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
