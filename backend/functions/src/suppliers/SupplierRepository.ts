import { Timestamp } from 'firebase-admin/firestore'

import { EntityUpdate, Supplier, SupplierConverter, SupplierDBModel, defaultSupplierData } from '@tipi/shared'

import { firestore } from '../FirebaseInit'

export const getSuppliersRef = () =>
    firestore.collection('organizations/demo/suppliers').withConverter<Supplier, SupplierDBModel>(SupplierConverter)

export const getSupplierRefById = (id: string) => getSuppliersRef().doc(id)

export const getSupplierById = async (id: string): Promise<Supplier> => {
    const supplier = (await getSupplierRefById(id).get()).data()
    if (!supplier) {
        throw new Error(`Supplier not found id: ${id}`)
    }
    return supplier as Supplier
}

export const createSupplier = async (supplierData: EntityUpdate<SupplierDBModel>): Promise<Supplier> => {
    const supplier = {
        id: 'new', // REMOVED BY THE CONVERTER
        ...defaultSupplierData,
        ...supplierData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    }
    const supplierRef = await getSuppliersRef().add(supplier)
    return getSupplierById(supplierRef.id)
}

export const updateSupplier = async (id: string, supplierData: EntityUpdate<SupplierDBModel>): Promise<Supplier> => {
    const supplierRef = getSupplierRefById(id)

    await supplierRef.update({
        ...supplierData,
        updatedAt: Timestamp.now(),
    })

    const updatedSupplier = await supplierRef.get()
    return updatedSupplier.data() as Supplier
}
