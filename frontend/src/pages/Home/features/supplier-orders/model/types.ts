export interface SupplierOrderProduct {
    id: string
    name: string
    quantity: number
    price: number
}

export interface SupplierOrder {
    id: string
    origin: string
    destination: string
    status: 'pending' | 'transit' | 'delivered'
    orderDate: string
    estimatedDate: string
    products: SupplierOrderProduct[]
    total: number
}
