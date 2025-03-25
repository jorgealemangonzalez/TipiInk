import { QueryDocumentSnapshot } from './QueryDocumentSnapshot'

/**
 * Copy of the FirestoreDataConverter type from firebase/firestore to avoid the dependency.
 */
export interface FirestoreDataConverter<T, R> {
    toFirestore: (recipe: T) => R
    /**
     *
     * @param snapshot
     * @param options Added optional options parameter as it will be used in frontend and backend
     * (firebase/firestore and firebase-admin/firestore have different signatures for the data method)
     * @returns
     */
    fromFirestore: (snapshot: QueryDocumentSnapshot<T, R>, options?: any) => T
}
