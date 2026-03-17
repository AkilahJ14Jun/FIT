import React, { useEffect, useState } from 'react'
import { Button, Card, Input, Select, Table, Modal } from '../components'
import { Customer, Delivery, Bill } from '../types'
import { customerService, deliveryService, billingService } from '../services'

export const Billing: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerDeliveries, setCustomerDeliveries] = useState<Delivery[]>([])
  const [selectedDeliveries, setSelectedDeliveries] = useState<number[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [previewData, setPreviewData] = useState<unknown>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCustomers()
    fetchBills()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAll({ limit: 1000 })
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchBills = async () => {
    try {
      const response = await billingService.getAll()
      setBills(response)
    } catch (error) {
      console.error('Error fetching bills:', error)
    }
  }

  const handleCustomerSelect = async (customerId: string) => {
    if (!customerId) {
      setSelectedCustomer(null)
      setCustomerDeliveries([])
      return
    }

    const customer = customers.find(c => c.id === Number(customerId))
    setSelectedCustomer(customer || null)

    try {
      const deliveries = await deliveryService.getByCustomer(Number(customerId))
      setCustomerDeliveries(deliveries.filter(d => !d.billNumber))
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    }
  }

  const toggleDeliverySelection = (deliveryId: number) => {
    setSelectedDeliveries(prev =>
      prev.includes(deliveryId)
        ? prev.filter(id => id !== deliveryId)
        : [...prev, deliveryId]
    )
  }

  const handlePreview = async () => {
    if (selectedDeliveries.length === 0) {
      alert('Please select at least one delivery')
      return
    }
    try {
      const preview = await billingService.preview(selectedDeliveries)
      setPreviewData(preview)
      setPreviewModalOpen(true)
    } catch (error) {
      console.error('Error previewing bill:', error)
    }
  }

  const handleGenerateBill = async () => {
    if (!selectedCustomer || selectedDeliveries.length === 0) return
    try {
      await billingService.createConsolidated({
        customerId: selectedCustomer.id,
        deliveryIds: selectedDeliveries,
        billDate: new Date().toISOString().split('T')[0],
      })
      setPreviewModalOpen(false)
      setSelectedDeliveries([])
      setCustomerDeliveries([])
      setSelectedCustomer(null)
      fetchBills()
      alert('Bill generated successfully!')
    } catch (error) {
      console.error('Error generating bill:', error)
    }
  }

  const handleDownloadPdf = async (billId: number) => {
    try {
      const blob = await billingService.downloadPdf(billId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bill-${billId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  const customerOptions = customers.map(c => ({ value: c.id, label: c.name }))

  const billColumns = [
    { key: 'billNumber', header: 'Bill #' },
    { key: 'billDate', header: 'Date' },
    {
      key: 'customer',
      header: 'Customer',
      render: (bill: Bill) => bill.customer?.name || 'Unknown',
    },
    { key: 'totalBoxes', header: 'Total Boxes' },
    {
      key: 'actions',
      header: 'Actions',
      render: (bill: Bill) => (
        <Button size="sm" onClick={() => handleDownloadPdf(bill.id)}>
          Download PDF
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <Card title="Generate New Bill">
        <div className="space-y-4">
          <Select
            label="Select Customer"
            options={customerOptions}
            value={selectedCustomer?.id?.toString() || ''}
            onChange={e => handleCustomerSelect(e.target.value)}
          />

          {selectedCustomer && customerDeliveries.length > 0 && (
            <>
              <p className="text-sm text-gray-600">
                Select deliveries to include in the bill:
              </p>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedDeliveries.length === customerDeliveries.length
                          }
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedDeliveries(customerDeliveries.map(d => d.id))
                            } else {
                              setSelectedDeliveries([])
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Bill #</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerDeliveries.map(delivery => (
                      <tr key={delivery.id}>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedDeliveries.includes(delivery.id)}
                            onChange={() => toggleDeliverySelection(delivery.id)}
                          />
                        </td>
                        <td className="px-4 py-2">{delivery.date}</td>
                        <td className="px-4 py-2">{delivery.billNumber}</td>
                        <td className="px-4 py-2">{delivery.quantitySent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handlePreview} disabled={selectedDeliveries.length === 0}>
                  Preview Bill
                </Button>
              </div>
            </>
          )}

          {selectedCustomer && customerDeliveries.length === 0 && (
            <p className="text-gray-500">No unbilled deliveries for this customer.</p>
          )}
        </div>
      </Card>

      <Card title="Bill History">
        <Table
          data={bills}
          columns={billColumns}
          keyExtractor={item => item.id}
          isLoading={isLoading}
          emptyMessage="No bills generated yet"
        />
      </Card>

      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Bill Preview"
        size="lg"
      >
        {previewData && (
          <div className="space-y-4">
            <div className="border p-4 rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Bill Number: </span>
                  {(previewData as { billNumber: string }).billNumber}
                </div>
                <div>
                  <span className="font-medium">Customer: </span>
                  {(previewData as { customerName: string }).customerName}
                </div>
                <div>
                  <span className="font-medium">Shop: </span>
                  {(previewData as { shopName: string }).shopName}
                </div>
                <div>
                  <span className="font-medium">Date: </span>
                  {(previewData as { billDate: string }).billDate}
                </div>
              </div>

              <table className="w-full mt-4 border-t">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Sent</th>
                    <th className="text-right py-2">Returned</th>
                    <th className="text-right py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {(previewData as { deliveries: Array<{ date: string; description: string; quantitySent: number; quantityReturned: number; balance: number }> }).deliveries.map(
                    (delivery, idx) => (
                      <tr key={idx} className="border-b">
                        <td>{delivery.date}</td>
                        <td>{delivery.description}</td>
                        <td className="text-right">{delivery.quantitySent}</td>
                        <td className="text-right">{delivery.quantityReturned}</td>
                        <td className="text-right">{delivery.balance}</td>
                      </tr>
                    )
                  )}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={4} className="text-right py-2">Total:</td>
                    <td className="text-right py-2">
                      {(previewData as { totalBoxes: number }).totalBoxes}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setPreviewModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateBill}>Generate Bill</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
