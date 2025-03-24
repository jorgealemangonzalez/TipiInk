import { useEffect } from 'react'

import { useCollection } from '@/firebase/hooks/useCollection'
import { Supplier, supplierConverter } from '@tipi/shared'

import { SUPPLIERS } from './suppliersMocks'

export const useSuppliers = () => {
    const {
        results: suppliers,
        isLoading,
        addDocument,
        updateDocument,
        removeDocument,
    } = useCollection<Supplier>({
        path: 'suppliers',
        converter: supplierConverter,
    })

    useEffect(() => {
        const initializeSuppliers = async () => {
            if (!isLoading && suppliers.length === 0) {
                console.log('No suppliers found, initializing with mock data')

                for (const supplier of SUPPLIERS) {
                    await addDocument(supplier)
                }
            }
        }

        initializeSuppliers()
    }, [isLoading, suppliers.length, addDocument])

    const getAllSuppliers = () => suppliers

    return {
        suppliers,
        isLoading,
        updateDocument,
        removeDocument,
        getAllSuppliers,
    }
}

