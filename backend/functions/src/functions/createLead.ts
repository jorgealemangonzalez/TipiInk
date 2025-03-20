import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { CreateLeadRequest, Lead } from '../types/Lead'
import { onCallUnauthenticated, Request } from '../FirebaseInit'
/**
 * Creates a new lead in the database
 * This function is public and doesn't require authentication
 */
export const createLead = onCallUnauthenticated(async (request: Request<CreateLeadRequest>) => {
    const data = request.data
    try {
        // Validate input data
        if (!data.name || !data.phone || !data.weeklyOrders) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'The function must be called with name, phone and weeklyOrders.'
            )
        }

        // Create lead object
        const lead: Lead = {
            name: data.name,
            phone: data.phone,
            weeklyOrders: data.weeklyOrders,
            createdAt: new Date(),
        }

        // Save to Firestore
        const leadRef = await admin.firestore().collection('leads').add(lead)

        return {
            success: true,
            leadId: leadRef.id,
        }
    } catch (error) {
        console.error('Error creating lead:', error)
        throw new functions.https.HttpsError('internal', 'An error occurred while creating the lead.')
    }
})
