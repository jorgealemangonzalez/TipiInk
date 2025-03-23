export interface Supplier {
    id: string
    name: string
    type: 'pescaderia' | 'fruteria' | 'carniceria'
    totalOrders?: number
    lastMonthInvoiced?: number
    pendingIncidents?: number
    commercialPhone?: string
    deliveryPhone?: string
    deliveryDays?: string[]
    orderAdvanceHours?: number
    invoices?: Invoice[]
    deliveryNotes: DeliveryNote[]
    incidents?: Incident[]
    phone?: string
}

export interface Invoice {
    id: string
    date: string
    total: number
    pdfUrl?: string
    status: 'pending' | 'paid'
}

export interface DeliveryNote {
    id: string
    date: string
    total: number
    hasIncidents: boolean
    invoiceId?: string
    incidentDetails?: {
        description: string
        affectedItems: string[]
        reportDate: string
        status: 'pending' | 'resolved'
    }
}

export interface SupplierIncident {
    id: string
    type: 'delivery_delay' | 'quality_issue' | 'price_discrepancy' | 'missing_delivery'
    status: 'pending' | 'resolved'
    createdAt: string
    description: string
}

export interface SupplierStats {
    totalOrders: number
    lastMonthInvoiced: number
    pendingIncidents: number
}

export interface Incident {
    id: string
    description: string
    date: string
    status: 'pending' | 'resolved'
    type:
        | 'albaran_missing'
        | 'amount_correction'
        | 'delivery_compensation'
        | 'delivery_delay'
        | 'quality_issue'
        | 'price_discrepancy'
        | 'missing_delivery'
}
