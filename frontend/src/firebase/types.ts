import { DocumentData } from 'firebase/firestore'

export interface Document extends DocumentData {
    id: string
}
