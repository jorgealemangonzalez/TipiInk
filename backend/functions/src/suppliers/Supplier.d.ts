import { Timestamp } from 'firebase-admin/firestore'

export type SupplierType = 'pescaderia' | 'fruteria' | 'carniceria'

export type IncidentStatus = 'pending' | 'resolved'

export type IncidentType =
    | 'albaran_missing'
    | 'amount_correction'
    | 'delivery_compensation'
    | 'delivery_delay'
    | 'quality_issue'
    | 'price_discrepancy'
    | 'missing_delivery'

export interface IncidentDetails {
    description: string
    affectedItems: string[]
    reportDate: string
    status: IncidentStatus
}

export interface Incident {
    id: string
    description: string
    date: string
    status: IncidentStatus
    type: IncidentType
}

export interface DeliveryNote {
    id: string
    date: string
    total: number
    hasIncidents: boolean
    invoiceId?: string
    incidentDetails?: IncidentDetails
}

export interface Invoice {
    id: string
    date: string
    total: number
    pdfUrl?: string
    status: 'pending' | 'paid'
}

export interface SupplierDBModel {
    name: string
    type: SupplierType
    totalOrders: number
    lastMonthInvoiced: number
    pendingIncidents: number
    commercialPhone?: string
    deliveryPhone?: string
    deliveryDays: string[]
    orderAdvanceHours: number
    invoices: Invoice[]
    deliveryNotes: DeliveryNote[]
    incidents?: Incident[]
    phone?: string
    createdAt: Timestamp
    updatedAt: Timestamp
    chunkId?: string // Trive Chunk ID
}

export interface Supplier extends SupplierDBModel {
    id: string
}
