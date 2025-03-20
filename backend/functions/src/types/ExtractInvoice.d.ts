import { Timestamp } from 'firebase-admin/lib/firestore'

export type ExtractInvoiceRequest = {
    imagePath: string // inside cloud storage
}

// Raw TypeScript definitions for itemSchema
export interface Item {
    item?: string | null;
    price?: number | null;
    total?: number | null;
    quantity?: number | null;
    vat_type?: number | null;
}

// Raw TypeScript definitions for invoiceSchema
export interface Invoice {
    id: string
    provider?: string | null;
    serial_number?: string | null;
    items?: Item[] | null;
    subtotal?: number | null;
    total_vat_type?: number | null;
    total_vat?: number | null;
    total?: number | null;
    createdAt: Timestamp
}

export type ExtractInvoiceResponse = {
    invoiceId: string
}
