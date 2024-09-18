import * as admin from 'firebase-admin'
import {https} from 'firebase-functions'

export const createImpersonationToken = https.onCall(async (data: { email: string }, context) => {
    // Check if the current user is an administrator
    if (!context.auth || !context.auth.token.admin) {
        throw new https.HttpsError('permission-denied', 'Only admins can impersonate users')
    }

    const {email} = data
    if (!email) {
        throw new https.HttpsError('invalid-argument', 'Email is required')
    }

    try {
        const user = await admin.auth().getUserByEmail(email)
        const customToken = await admin.auth().createCustomToken(user.uid)
        return {token: customToken}
    } catch (error: any) {
        throw new https.HttpsError('internal', `Error creating the impersonation token: ${error.message}`, error)
    }
})
