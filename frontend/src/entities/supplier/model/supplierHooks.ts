import { useEffect } from 'react'

import { useCollection } from '@/firebase/hooks/useCollection'
import { Supplier, SupplierConverter } from '@tipi/shared'

import { SUPPLIERS } from './suppliersMocks'

// Helper function to sanitize supplier data for Firestore
const sanitizeSupplierForFirestore = (supplier: any): Supplier => {
    // Create a new object with all properties, replacing undefined with appropriate defaults
    return {
        ...supplier,
        incidents: supplier.incidents || [],
        phone: supplier.phone || null,
        commercialPhone: supplier.commercialPhone || null,
        deliveryPhone: supplier.deliveryPhone || null,
        totalOrders: supplier.totalOrders || 0,
        lastMonthInvoiced: supplier.lastMonthInvoiced || 0,
        pendingIncidents: supplier.pendingIncidents || 0,
        deliveryDays: supplier.deliveryDays || [],
        orderAdvanceHours: supplier.orderAdvanceHours || 0,
        invoices: supplier.invoices || [],
        chunkId: supplier.chunkId || null,
    }
}

export const useSuppliers = () => {
    const {
        results: suppliers,
        isLoading,
        addDocument,
        updateDocument,
        removeDocument,
    } = useCollection<Supplier>({
        path: 'organizations/demo/suppliers',
        converter: SupplierConverter,
    })

    useEffect(() => {
        const initializeSuppliers = async () => {
            if (!isLoading && suppliers.length === 0) {
                console.log('No suppliers found, initializing with mock data')

                for (const supplier of SUPPLIERS) {
                    console.log('supplier', supplier)
                    // Sanitize supplier data to prevent Firestore errors from undefined values
                    const sanitizedSupplier = sanitizeSupplierForFirestore(supplier)
                    await addDocument(sanitizedSupplier)
                }
            }
        }

        initializeSuppliers()
    }, [isLoading, suppliers.length, addDocument])

    const getAllSuppliers = () => suppliers

    console.log('supplierstest', suppliers)

    return {
        suppliers,
        isLoading,
        updateDocument,
        removeDocument,
        getAllSuppliers,
    }
}
