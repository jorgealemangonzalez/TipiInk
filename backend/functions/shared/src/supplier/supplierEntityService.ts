import { DeliveryNote, SupplierDBModel } from './SupplierEntity'

export const getTotalPendingInvoices = (supplier: SupplierDBModel) => {
    return supplier.invoices.filter(invoice => invoice.status === 'pending').length
}

export const getTotalPendingInvoicesAmount = (supplier: SupplierDBModel) => {
    return supplier.invoices
        .filter(invoice => invoice.status === 'pending')
        .reduce((acc, invoice) => acc + invoice.total, 0)
}

export const getTotalPaidInvoicesAmount = (supplier: SupplierDBModel) => {
    return supplier.invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((acc, invoice) => acc + invoice.total, 0)
}

export const getDeliveryNotesWithoutInvoice = (supplier: SupplierDBModel) => {
    return supplier.deliveryNotes.filter(deliveryNote => !deliveryNote.invoiceId)
}

export const getDeliveryNotesWithIncidents = (supplier: SupplierDBModel) => {
    return supplier.deliveryNotes.filter(deliveryNote => deliveryNote.hasIncidents)
}

export const getTotalAmountByDeliveryNotes = (deliveryNotes: DeliveryNote[]) => {
    return deliveryNotes.reduce((acc, deliveryNote) => acc + deliveryNote.total, 0)
}

export const getPendingIncidentsCount = (supplier: SupplierDBModel) => {
    if (!supplier.incidents || supplier.incidents.length === 0) {
        return 0
    }
    return supplier.incidents.filter(incident => incident.status === 'pending').length
}

export const getPendingIncidents = (supplier: SupplierDBModel) => {
    if (!supplier.incidents || supplier.incidents.length === 0) {
        return []
    }
    return supplier.incidents.filter(incident => incident.status === 'pending')
}

export const getResolvedIncidents = (supplier: SupplierDBModel) => {
    if (!supplier.incidents || supplier.incidents.length === 0) {
        return []
    }
    return supplier.incidents.filter(incident => incident.status === 'resolved')
}

export const getLastInvoiceDate = (supplier: SupplierDBModel) => {
    if (supplier.invoices.length === 0) {
        return null
    }

    return supplier.invoices
        .map(invoice => invoice.date)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
}

export const getInvoiceById = (supplier: SupplierDBModel, invoiceId: string) => {
    return supplier.invoices.find(invoice => invoice.id === invoiceId)
}

export const getDeliveryNoteById = (supplier: SupplierDBModel, deliveryNoteId: string) => {
    return supplier.deliveryNotes.find(deliveryNote => deliveryNote.id === deliveryNoteId)
}

export const getIncidentById = (supplier: SupplierDBModel, incidentId: string) => {
    if (!supplier.incidents) return undefined
    return supplier.incidents.find(incident => incident.id === incidentId)
}
