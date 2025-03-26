import { FirestoreDataConverter } from '../firebase/FirestoreDataConverter'
import { QueryDocumentSnapshot } from '../firebase/QueryDocumentSnapshot'
import { Supplier, SupplierDBModel } from './SupplierEntity'

export const SupplierConverter: FirestoreDataConverter<Supplier, SupplierDBModel> = {
    toFirestore: (supplier: Supplier) => ({
        name: supplier.name,
        type: supplier.type,
        totalOrders: supplier.totalOrders,
        lastMonthInvoiced: supplier.lastMonthInvoiced,
        pendingIncidents: supplier.pendingIncidents,
        commercialPhone: supplier.commercialPhone,
        deliveryPhone: supplier.deliveryPhone,
        deliveryDays: supplier.deliveryDays,
        orderAdvanceHours: supplier.orderAdvanceHours,
        invoices: supplier.invoices,
        deliveryNotes: supplier.deliveryNotes,
        incidents: supplier.incidents,
        phone: supplier.phone,
        chunkId: supplier.chunkId,
    }),
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
