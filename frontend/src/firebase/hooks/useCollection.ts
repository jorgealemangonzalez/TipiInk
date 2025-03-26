import { useCallback, useEffect, useState } from 'react'

import { EntityUpdate } from '@tipi/shared'

import { deleteDocument, setDocument } from '../DocumentsDAO'
import { GetCollectionParams, listenCollection } from '../getCollection'
import { FSDocument } from '../types'

interface UseCollectionsResponse<T extends FSDocument> {
    results: T[]
    hasReachedEnd: boolean
    loadMore: () => void
    isLoading: boolean
    addDocument: (data: EntityUpdate<T>) => Promise<T>
    updateDocument: (id: string, data: EntityUpdate<T>) => Promise<void>
    removeDocument: (id: string) => Promise<void>
}

const removeDuplicates = <T extends FSDocument>(a: T[], b: T[]): T[] => {
    const uniques = new Map()

    a.forEach(value => uniques.set(value.id, value))
    b.forEach(value => uniques.set(value.id, value))

    return Array.from(uniques.values())
}

export const useCollection = <T extends FSDocument>({
    path,
    orderBy,
    limit,
    where,
    converter,
}: GetCollectionParams): UseCollectionsResponse<T> => {
    const params = { path, orderBy, limit, where, converter }
    const [startAfter, setStartAfter] = useState<number | undefined>(undefined)
    const [hasReachedEnd, setHasReachedEnd] = useState(false)
    const [results, setResults] = useState<T[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let unsubscribe = () => {}
        const fetchResults = async () => {
            unsubscribe = await listenCollection<T>({ ...params, startAfter, converter }, upToDateDocs => {
                if (upToDateDocs.length) {
                    setResults(prev => {
                        console.log('where', where)
                        console.log('upToDateDocs', upToDateDocs)
                        return startAfter ? removeDuplicates(prev, upToDateDocs) : upToDateDocs
                    })
                } else {
                    setHasReachedEnd(true)
                }
                setIsLoading(false)
            })
        }

        fetchResults()
        return () => {
            unsubscribe()
        }
    }, [path, limit, startAfter, where, converter])

    const loadMore = () => {
        if (!results.length) setHasReachedEnd(true)
        else {
            const orderByField = orderBy![0] as string
            const lastElementTime = results[results.length - 1][orderByField] as number
            setStartAfter(lastElementTime)
        }
    }

    const addDocument = useCallback(
        async (data: EntityUpdate<T>) => {
            const timestamp = Date.now()
            const docWithTimestamps = {
                ...(data as object),
                createdAt: timestamp,
                updatedAt: timestamp,
            }
            const newDoc = await setDocument<typeof docWithTimestamps>({
                collectionName: path,
                data: docWithTimestamps,
                converter,
            })
            const typedDoc = newDoc as unknown as T
            setResults(prev => [...prev, typedDoc])
            return typedDoc
        },
        [path, converter],
    )

    const updateDocument = useCallback(
        async (id: string, data: EntityUpdate<T>) => {
            console.log('updateDocument', id, data)
            const updatedData = {
                ...(data as object),
                updatedAt: Date.now(),
            }
            await setDocument<typeof updatedData>({
                collectionName: path,
                id,
                data: updatedData,
                converter,
            })
            setResults(prev => prev?.map(doc => (doc.id === id ? ({ ...doc, ...updatedData } as T) : doc)) ?? [])
        },
        [path, converter],
    )

    const removeDocument = useCallback(
        async (id: string) => {
            await deleteDocument({
                collectionName: path,
                id,
                converter,
            })
            setResults(prev => prev?.filter(doc => doc.id !== id) ?? [])
        },
        [path, converter],
    )

    return {
        results: results ?? [],
        hasReachedEnd,
        loadMore,
        isLoading,
        addDocument,
        updateDocument,
        removeDocument,
    }
}
