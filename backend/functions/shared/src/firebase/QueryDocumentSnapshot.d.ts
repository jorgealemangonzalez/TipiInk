import { Timestamp } from '../firebase/Timestamp'

/**
 * Copy of the QueryDocumentSnapshot type from firebase/firestore to avoid the dependency.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface QueryDocumentSnapshot<T, DbModelType> {
    id: string
    createTime: Timestamp
    updateTime: Timestamp
    /**
     * @param options Added optional options parameter as it will be used in frontend and backend
     * (firebase/firestore and firebase-admin/firestore have different signatures for the data method)
     */
    data(options?: any): DbModelType
}
