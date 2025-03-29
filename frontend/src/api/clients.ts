import { httpsCallable } from 'firebase/functions'

import { functions } from '@/firebase/firebase.ts'
import { ExtractInvoiceRequest, ExtractInvoiceResponse } from '@tipi/shared'

const extractInvoiceFn = httpsCallable<ExtractInvoiceRequest, ExtractInvoiceResponse>(functions, 'extractInvoice')

export const extractInvoice = (req: ExtractInvoiceRequest) => extractInvoiceFn(req).then(res => res.data)
