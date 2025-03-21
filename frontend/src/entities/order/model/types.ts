export type OrderStatus = 'confirmed' | 'unconfirmed' | 'with_delivery_time'
export type UnitFormat = 'kg' | 'ud' | 'Lts' | 'Cajas' | 'gr'
export type SupplierCategory = 'pescado' | 'carne' | 'frutaVerdura' | 'seco' | 'congelado' | 'limpieza'

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

export interface OrderItem {
    name: string
    quantity: number
    unitPrice: number
    unitFormat: UnitFormat
    observations?: string
}

export interface PendingOrder {
    supplierName: string
    category: SupplierCategory
    requestedDeliveryTime: Date
    items: OrderItem[]
    estimatedPrice: number
}
