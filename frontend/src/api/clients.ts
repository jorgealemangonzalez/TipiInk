import {httpsCallable} from "firebase/functions"
import {functions} from "@/firebase/firebase.ts"

const extractInvoiceFn = httpsCallable<void, object>(functions, 'extractInvoice')
export const extractInvoice = (req: void) => extractInvoiceFn(req).then(res => res.data)
