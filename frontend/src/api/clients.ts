import { httpsCallable } from 'firebase/functions'

import { functions } from '@/firebase/firebase.ts'
import { ExtractInvoiceRequest, ExtractInvoiceResponse } from '@monorepo/functions/src/types/ExtractInvoice'

const extractInvoiceFn = httpsCallable<ExtractInvoiceRequest, ExtractInvoiceResponse>(functions, 'extractInvoice')

export const extractInvoice = (req: ExtractInvoiceRequest) => extractInvoiceFn(req).then(res => res.data)
