export type OrderStatus = 'confirmed' | 'unconfirmed' | 'with_delivery_time'

export interface OrderProduct {
  id: string
  name: string
  quantity: number
}

export interface Order {
  id: string
  status: OrderStatus
  deliveryTime?: string
  contactPhone: string
  products: OrderProduct[]
  createdAt: string
} 