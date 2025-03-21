import {
    FirestoreDataConverter,
    Unsubscribe,
    collection,
    limit as fLimit,
    orderBy as fOrderBy,
    query as fQuery,
    startAfter as fStartAfter,
    where as fWhere,
    getDocs,
    onSnapshot,
} from 'firebase/firestore'

import { firestore } from './firebase.ts'
import { FSDocument } from './types.ts'

export interface GetCollectionParams {
    path: string
    orderBy?: Parameters<typeof fOrderBy>
    limit?: number
    startAfter?: number
    where?: Parameters<typeof fWhere>[]
    converter?: FirestoreDataConverter<any>
}

export const listenCollection = async <T extends FSDocument>(
    { path, orderBy, limit, startAfter, where, converter }: GetCollectionParams,
    onCollectionChange: (docs: T[]) => void,
): Promise<Unsubscribe> => {
    const ref = converter ? collection(firestore, path).withConverter(converter) : collection(firestore, path)

    const query = fQuery(
        ref,
        ...[
            ...(where ? where.map(w => fWhere(...w)) : []),
            ...(orderBy ? [fOrderBy(...orderBy)] : []),
            ...(limit ? [fLimit(limit)] : []),
            ...(startAfter ? [fStartAfter(startAfter)] : []),
        ],
    )

    return onSnapshot(query, snapshot => {
        const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as T)
        onCollectionChange(docs)
    })
}

export const getCollection = async <T extends FSDocument>({
    path,
    orderBy,
    limit,
    startAfter,
    where,
    converter,
}: GetCollectionParams): Promise<T[]> => {
    const ref = converter ? collection(firestore, path).withConverter(converter) : collection(firestore, path)

    const query = fQuery(
        ref,
        ...[
            ...(where ? where.map(w => fWhere(...w)) : []),
            ...(orderBy ? [fOrderBy(...orderBy)] : []),
            ...(limit ? [fLimit(limit)] : []),
            ...(startAfter ? [fStartAfter(startAfter)] : []),
        ],
    )
    console.log('query', query)
    const docs = await getDocs(query)
    return docs.docs.map(doc => ({ ...doc.data(), id: doc.id }) as T)
}
