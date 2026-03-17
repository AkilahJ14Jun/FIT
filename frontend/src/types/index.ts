export interface Customer {
  id: number
  name: string
  shopName: string
  address: string
  mobileNumber: string
  createdAt: string
  updatedAt: string
}

export interface BoxType {
  id: number
  capacity: number
  description: string
  createdAt: string
  updatedAt: string
}

export interface Container {
  id: number
  purchaseDate: string
  quantity: number
  supplier: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Driver {
  id: number
  name: string
  contactNumber: string
  createdAt: string
  updatedAt: string
}

export interface Vehicle {
  id: number
  vehicleNumber: string
  type: string
  createdAt: string
  updatedAt: string
}

export interface ExternalSource {
  id: number
  name: string
  contactDetails: string
  createdAt: string
  updatedAt: string
}

export interface Delivery {
  id: number
  billNumber: string
  date: string
  quantitySent: number
  quantityReturned: number
  balance: number
  description: string
  customerId: number
  customer?: Customer
  boxTypeId: number
  boxType?: BoxType
  driverId?: number
  driver?: Driver
  vehicleId?: number
  vehicle?: Vehicle
  externalSourceId?: number
  externalSource?: ExternalSource
  isOpeningBalance: boolean
  createdAt: string
  updatedAt: string
}

export interface Bill {
  id: number
  billNumber: string
  customerId: number
  customer?: Customer
  deliveryIds: number[]
  deliveries?: Delivery[]
  totalBoxes: number
  billDate: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  message: string
  statusCode: number
}
