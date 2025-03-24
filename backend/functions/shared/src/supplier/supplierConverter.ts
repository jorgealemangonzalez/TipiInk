import { FirestoreDataConverter } from '../firebase/FirestoreDataConverter'
import { QueryDocumentSnapshot } from '../firebase/QueryDocumentSnapshot'
import { Supplier, SupplierDBModel } from './supplierEntity'

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
            console.log('fromFirestore with options', snapshot.data(options))
            supplier = snapshot.data(options)
        } else {
            supplier = snapshot.data()
        }
        console.log('supplier.pendingIncidents', supplier)

        return {
            ...supplier,
            id: snapshot.id,
        } as Supplier
    },
}
