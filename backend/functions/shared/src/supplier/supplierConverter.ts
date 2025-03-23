import { FirestoreDataConverter } from '../firebase/FirestoreDataConverter'

import { QueryDocumentSnapshot } from '../firebase/QueryDocumentSnapshot'
import { Supplier, SupplierDBModel } from './supplierEntity'
import { getPendingIncidentsCount } from './supplierEntityService'

export const supplierConverter: FirestoreDataConverter<Supplier, SupplierDBModel> = {
    toFirestore: (supplier: Supplier) => {
        console.log('toFirestore', supplier)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...supplierData } = supplier
        return supplierData
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<Supplier, SupplierDBModel>, options?: any) => {
        console.log('fromFirestore', snapshot)
        let supplier: SupplierDBModel
        if (options) {
            supplier = snapshot.data(options)
        } else {
            supplier = snapshot.data()
        }

        const pendingIncidentsCount = getPendingIncidentsCount(supplier)
        if (supplier.pendingIncidents !== pendingIncidentsCount) {
            supplier.pendingIncidents = pendingIncidentsCount
        }

        return {
            ...supplier,
            id: snapshot.id,
        } as Supplier
    },
}
