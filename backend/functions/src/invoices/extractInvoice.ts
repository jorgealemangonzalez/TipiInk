import axios from 'axios'
import { Timestamp } from 'firebase-admin/firestore'
import { getDownloadURL } from 'firebase-admin/storage'
import { https, logger } from 'firebase-functions/v1'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import { firestore, isLocalEnvironment, storage } from '../FirebaseInit'
import { throwIfUnauthenticated } from '../auth/throwIfUnauthenticated'
import { onFunctionsInit } from '../firebase/OnFunctionsInit'
import { ExtractInvoiceRequest, ExtractInvoiceResponse, Invoice } from '../types/ExtractInvoice'
import { User } from '../types/User'
import { extractInvoicePrompt } from './extractInvoicePrompt'

let openai: OpenAI

onFunctionsInit(() => {
    openai = new OpenAI({ apiKey: process.env.OPENAI_SECRET_KEY })
})

const itemSchema = z
    .object({
        item: z.string().nullable().describe('The name of the item'),
        price: z.number().nullable().describe('The price per unit of the item'),
        total: z.number().nullable().describe('The total price of the item (including VAT)'),
        quantity: z.number().nullable().describe('The quantity of the item'),
        vat_type: z.number().nullable().describe('The type of VAT applied to the item'),
    })
    .strict()

const invoiceSchema = z
    .object({
        provider: z.string().nullable().describe('The name of the provider'),
        serial_number: z.string().nullable().describe('The serial number of the invoice'),
        items: z.array(itemSchema).nullable().describe('A list of items on the invoice'),
        subtotal: z.number().nullable().describe('The subtotal amount before VAT'),
        total_vat_type: z.number().nullable().describe('The type of the VAT applied to the total amount'),
        total_vat: z.number().nullable().describe('The total VAT amount'),
        total: z.number().nullable().describe('The total amount including VAT'),
    })
    .strict()

async function getInvoice(data: ExtractInvoiceRequest): Promise<Omit<Invoice, 'id' | 'createdAt'>> {
    const fileRef = storage.bucket().file(data.imagePath)

    let invoiceImageUrl = await getDownloadURL(fileRef)
    if (isLocalEnvironment()) {
        // Fetch the image as binary data using axios
        const response = await axios.get(invoiceImageUrl, { responseType: 'arraybuffer' })

        // Convert the binary data to a Base64 string
        invoiceImageUrl = 'data:image/jpeg;base64,' + Buffer.from(response.data, 'binary').toString('base64')
    }

    const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: extractInvoicePrompt,
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: invoiceImageUrl,
                        },
                    },
                ],
            },
        ],
        response_format: zodResponseFormat(invoiceSchema, 'invoice'),
        temperature: 0.5,
    })

    return completion.choices[0].message.parsed!
}

export const extractInvoice = https.onCall(
    async (data: ExtractInvoiceRequest, context): Promise<ExtractInvoiceResponse> => {
        const { uid } = throwIfUnauthenticated(context)

        if (!data.imagePath || !data.imagePath.startsWith(`users/${uid}`)) {
            throw new https.HttpsError('invalid-argument', 'Invalid imagePath')
        }

        const collectionReference = firestore.collection('users')
        const user = (await collectionReference.doc(uid).get()).data() as User
        const col = await collectionReference.get()
        logger.info('User', { user, size: col.size })
        col.forEach((doc: any) => {
            logger.info(`${doc.id} =>`, { data: doc.data(), uid })
        })
        const invoice = await getInvoice(data)
        const storedInvoiceRef = await firestore.collection(`companies/${user.companyId}/invoices`).add({
            ...invoice,
            createdAt: Timestamp.now(),
        })

        logger.log('Invoice:', { invoice })
        return { invoiceId: storedInvoiceRef.id }
    },
)
