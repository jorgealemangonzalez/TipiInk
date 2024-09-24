import {https} from 'firebase-functions'
import OpenAI from 'openai'
import {onFunctionsInit} from './OnFunctionsInit'
import {zodResponseFormat} from 'openai/helpers/zod'
import {z} from 'zod'


let openai: OpenAI

onFunctionsInit(() => {
    openai = new OpenAI({apiKey: process.env.OPENAI_SECRET_KEY})
})


const itemSchema = z.object({
    item: z.string().nullable().describe('The name of the item'),
    price: z.number().nullable().describe('The price per unit of the item'),
    total: z.number().nullable().describe('The total price of the item (including VAT)'),
    quantity: z.number().nullable().describe('The quantity of the item'),
    vat_type: z.string().nullable().describe('The type of VAT applied to the item'),
}).strict()

const invoiceSchema = z.object({
    provider: z.string().nullable().describe('The name of the provider'),
    serial_number: z.string().nullable().describe('The serial number of the invoice'),
    items: z.array(itemSchema).nullable().describe('A list of items on the invoice'),
    subtotal: z.number().nullable().describe('The subtotal amount before VAT'),
    total_vat_type: z.string().nullable().describe('The type of the VAT applied to the total amount'),
    total_vat: z.number().nullable().describe('The total VAT amount'),
    total: z.number().nullable().describe('The total amount including VAT'),
}).strict()

// Infer TypeScript types from the schema
export type Item = z.infer<typeof itemSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;

export const extractInvoice = https.onCall(async (data, context) => {
    // const invoiceImage = 'https://firebasestorage.googleapis.com/v0/b/tipi-ink.appspot.com/o/Invoice%201.jpeg?alt=media&token=a250118d-f536-436c-8d4c-77e01bbd8895'
    const invoiceImage = 'https://media.discordapp.net/attachments/1285166384904536065/1288166902950006784/Imagen_de_WhatsApp_2024-09-12_a_las_18.23.48_aab744bf.jpg?ex=66f4326a&is=66f2e0ea&hm=e4983c1ebe38da817939eb1ac34a87d352115a3f6a61169a2247c10636c0d722&=&format=webp&width=1537&height=865'


    const completion = await openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: `You are an advanced OCR system tasked with processing images of delivery notes and invoices uploaded by the user. Your goal is to analyze these images, extract the relevant data, and compare the information between the delivery notes and invoices to ensure consistency. You will automatically populate the fields in the corresponding screens of the app, following the predefined templates. Additionally, you must be flexible in recognizing different terminologies and use context to accurately extract data.

Instructions for analyzing delivery notes:
When processing an image of a delivery note, extract the following data and ensure it is correctly populated in the delivery note table:

Full supplier name (ensure the correct capitalization and any additional details such as legal suffixes: e.g., "S.L.", "S.A.", etc.).
Delivery note number (labeled as "Nº Albarán" or "Nº Serie", depending on the provider).
Date of the delivery note.
List of products (organized in a table with columns for):
Product name: Extract the full and exact product name without making assumptions or introducing errors. The product names should match the text exactly as written in the document, even if they are long or contain specific details like "Congelado", "R.S.", or "Cordero". Be strict with the product names and avoid introducing unnecessary abbreviations or variations.
Quantity: Ensure the correct quantity is captured from the appropriate column, distinguishing between "Uds." (units) and "Kg" (weight) where applicable.
Unit price (labeled as "Precio").
VAT type and percentage (you must capture the specific VAT percentage such as "10%", "21%", etc.).
Total price: Ensure the total price for each product is correctly calculated as unit price × quantity and matches the data in the document. Validate the totals to ensure that VAT is applied correctly.
Subtotal, Total VAT, and Total amount of the delivery note.
Additional instructions:
Be flexible in recognizing different terminology used by suppliers. For example, the delivery note number may have various labels depending on the provider but should be interpreted according to context.
Recognize and process tables, ensuring each row and column is captured fully.
Ensure that all rows in the table are captured, without omissions or errors.
Validate product names against the document. If the name appears to be incomplete or contains abbreviations, double-check it against the document to ensure accuracy. Avoid using terms like "R.S." unless they appear clearly in the original document.
Ensure that quantities and totals are pulled from the correct columns, considering differences between "Uds." (units) and "Kg" (weights), if applicable.
Verify totals: Ensure that totals are accurately calculated based on unit price and quantity, and the correct amount of VAT is applied. Recalculate totals if needed to ensure accuracy.
                `,
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            'url': invoiceImage,
                        },
                    },
                ],
            },
        ],
        response_format: zodResponseFormat(invoiceSchema, 'invoice'),
        temperature: 0.5,
    })

    const invoice:Invoice = completion.choices[0].message.parsed!

    console.log('Invoice:', {invoice})
    return invoice
})
