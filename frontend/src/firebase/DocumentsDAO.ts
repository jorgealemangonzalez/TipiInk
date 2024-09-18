import {doc, DocumentData, getDoc, getDocFromServer, onSnapshot, setDoc} from 'firebase/firestore'
import {Document} from './types'
import {firestore} from './firebase.ts'

export interface GetDocumentParams<T> {
    collectionName: string
    id: string
    onDocumentChange?: (doc: T) => void
}

const mapNullToUndefined = <T extends DocumentData>(data: T) =>
    Object.keys(data).reduce((acc, key) => (
        {...acc, [key]: data[key] === null ? undefined : data[key]})
    , {})

export const getDocument = 
    async <T extends Document>({ collectionName, id, onDocumentChange }: GetDocumentParams): Promise<T | undefined> => {

        console.log({collectionName, id})
        const docRef = doc(firestore, collectionName, id)
        const snapshot = await getDoc(docRef)
        if (!snapshot.exists()) return undefined

        if(onDocumentChange) {
            onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    onDocumentChange({ ...mapNullToUndefined(docSnapshot.data()), id: docSnapshot.id } as T)
                }
            })
        }

        return {...mapNullToUndefined(snapshot.data()), id: snapshot.id} as T
    }

export const getDocumentFromServer =
    async <T extends Document>({ collectionName, id }: GetDocumentParams): Promise<T | undefined> => {

        console.log({collectionName, id})
        const docRef = doc(firestore, collectionName, id)
        const snapshot = await getDocFromServer(docRef)
        if (!snapshot.exists()) return undefined
        return {...mapNullToUndefined(snapshot.data()), id: snapshot.id} as T
    }

export interface SetDocumentParams<T> {
    collectionName: string
    id: string
    data: Partial<T>
}

const mapUndefinedToNull = <T extends DocumentData>(data: T) => 
    Object.keys(data).reduce((acc, key) => (
        {...acc, [key]: data[key] === undefined ? null : data[key]})
    , {})

export const setDocument =
    async <T extends DocumentData>({ collectionName, id, data }: SetDocumentParams<T>): Promise<void> => {
        const docRef = doc(firestore, collectionName, id)
        await setDoc(docRef, mapUndefinedToNull(data), { merge: true })
    }
