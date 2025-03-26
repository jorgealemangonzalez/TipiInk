import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react'

import { FirestoreDataConverter } from 'firebase/firestore'

import { EntityUpdate } from '@tipi/shared'

import { GetDocumentParams, listenDocument, setDocument as setDocumentInDb } from '../DocumentsDAO.ts'
import { debounce } from '../debounce'
import { FSDocument } from '../types.ts'

interface BaseUseDocumentResponse<T> {
    setDocument: (doc: EntityUpdate<T>) => Promise<void>
    setDocumentSync: (doc: EntityUpdate<T>) => Promise<void>
    isLoading: boolean
}

interface UseDocumentResponseWithoutDefault<T> extends BaseUseDocumentResponse<T> {
    document?: T
}

interface UseDocumentResponseWithDefault<T> extends BaseUseDocumentResponse<T> {
    document: T
}

type UseDocumentPropsWithoutDefault<T> = GetDocumentParams<T> & {
    defaultValue?: undefined
    converter?: FirestoreDataConverter<any, any>
}

type UseDocumentPropsWithDefault<T> = GetDocumentParams<T> & {
    defaultValue: T
    converter?: FirestoreDataConverter<any, any>
}

type DocumentStore = Record<string, FSDocument | undefined>

type DocumentsContextValue = {
    documentsStore: DocumentStore
    setDocument: (key: string, value?: FSDocument) => void
}

const DocumentsContext = createContext<DocumentsContextValue | undefined>(undefined)

export const DocumentsProvider = ({ children }: PropsWithChildren) => {
    const [documentsStore, setDocumentsStore] = useState<DocumentStore>({})

    const setDocument = (key: string, value?: FSDocument) =>
        setDocumentsStore(prevStore => ({ ...prevStore, [key]: value }))

    return <DocumentsContext.Provider value={{ setDocument, documentsStore }}>{children}</DocumentsContext.Provider>
}

export function useDocument<T extends FSDocument>({
    collectionName,
    id,
    converter,
}: UseDocumentPropsWithoutDefault<T>): UseDocumentResponseWithoutDefault<T>
export function useDocument<T extends FSDocument>({
    collectionName,
    id,
    defaultValue,
    converter,
}: UseDocumentPropsWithDefault<T>): UseDocumentResponseWithDefault<T>

export function useDocument<T extends FSDocument>({
    collectionName,
    id,
    defaultValue = undefined,
    converter,
}: UseDocumentPropsWithDefault<T> | UseDocumentPropsWithoutDefault<T>):
    | UseDocumentResponseWithoutDefault<T>
    | UseDocumentResponseWithDefault<T> {
    const context = useContext(DocumentsContext)

    if (!context) throw new Error('useDocument must be used inside a DocumentsProvider')

    const { setDocument: setDocumentInStore, documentsStore } = context

    const docPath = `${collectionName}/${id}`
    const document = (documentsStore[docPath] as T) ?? defaultValue
    // Using callback to avoid recreation of the debounce function as it needs to store the timeuot ID
    const setDocumentInDbDebounced = useCallback(debounce(setDocumentInDb, 1000), [collectionName, id])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDoc = async () => {
            if (id) {
                const doc = await listenDocument<T>({
                    collectionName,
                    id,
                    onDocumentChange: (doc: T) => setDocumentInStore(docPath, doc),
                    converter,
                })
                if (doc === undefined && defaultValue !== undefined) {
                    setIsLoading(false)
                    return
                }
                setDocumentInStore(docPath, doc)
                setIsLoading(false)
            }
        }

        fetchDoc()
    }, [collectionName, id, converter])

    const setDocument = async (doc: EntityUpdate<T>) => {
        const updatedDocument = { ...document, ...(doc as Partial<T>) }
        setDocumentInStore(docPath, updatedDocument)
        setDocumentInDbDebounced({
            collectionName,
            id: (updatedDocument.id ?? id)!,
            data: updatedDocument,
            converter,
        })
    }

    const setDocumentSync = async (doc: EntityUpdate<T>) => {
        const updatedDocument = { ...document, ...(doc as Partial<T>) }
        setDocumentInStore(docPath, updatedDocument)
        await setDocumentInDb({
            collectionName,
            id: id!,
            data: updatedDocument,
            converter,
        })
    }

    return {
        document,
        setDocument,
        setDocumentSync,
        isLoading,
    }
}
