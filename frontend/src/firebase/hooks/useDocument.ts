import {useCallback, useEffect, useState} from 'react'
import {getDocument, GetDocumentParams, setDocument as setDocumentInDb} from '../DocumentsDAO.ts'
import {Document} from "../types.ts"
import {debounce} from '@/old/react/debounce.ts'

interface UseDocumentResponseWithoutDefault<T> {
    document?: T
    setDocument: (doc: Partial<T>) => Promise<void>
    setDocumentSync: (doc: Partial<T>) => Promise<void>
    setDocumentState: (doc: T) => void
}

interface UseDocumentResponseWithDefault<T> {
    document: T
    setDocument: (doc: Partial<T>) => Promise<void>
    setDocumentSync: (doc: Partial<T>) => Promise<void>
    setDocumentState: (doc: T) => void
}

type UseDocumentPropsWithoutDefault<T> = GetDocumentParams<T> & {
    defaultValue?: undefined
}

type UseDocumentPropsWithDefault<T> = GetDocumentParams<T> & {
    defaultValue: T
}

export function useDocument<T extends Document>({collectionName, id}: UseDocumentPropsWithoutDefault<T>)
    : UseDocumentResponseWithoutDefault<T>
export function useDocument<T extends Document>({collectionName, id, defaultValue}: UseDocumentPropsWithDefault<T>)
    : UseDocumentResponseWithDefault<T>

export function useDocument <T extends Document>(
    { collectionName, id, defaultValue=undefined }: UseDocumentPropsWithDefault<T> | UseDocumentPropsWithoutDefault<T>
): UseDocumentResponseWithoutDefault<T> | UseDocumentResponseWithDefault<T> {
    const [document, setDocumentState] = useState<T | undefined>(defaultValue)
    // Using callback to avoid recreation of the debounce function as it needs to store the timeuot ID
    const setDocumentInDbDebounced = useCallback(debounce(setDocumentInDb, 1000), [collectionName, id])

    useEffect(() => {
        const fetchDoc = async () => {
            if (id) {
                const doc = await getDocument<T>(
                    {
                        collectionName,
                        id,
                        onDocumentChange: (doc: T) => setDocumentState(doc)
                    },
                )
                if(doc === undefined && defaultValue !== undefined) {
                    return
                }
                console.log({doc, id, collectionName})
                setDocumentState(doc)
            }
        }

        fetchDoc()
    }, [collectionName, id])

    const setDocument = async (doc: Partial<T>) => {
        setDocumentState({...document, ...doc} as T)
        setDocumentInDbDebounced({collectionName, id: id!, data: doc})
    }

    const setDocumentSync = async (doc: Partial<T>) => {
        setDocumentState({...document, ...doc} as T)
        await setDocumentInDb({collectionName, id: id!, data: doc})
    }

    return {
        document,
        setDocument,
        setDocumentSync,
        setDocumentState,
    }
}

