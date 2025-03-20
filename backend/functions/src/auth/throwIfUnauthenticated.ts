import { AuthData, CallableContext } from 'firebase-functions/lib/common/providers/https'
import * as functions from 'firebase-functions'
import { auth } from 'firebase-admin'

export const throwIfUnauthenticated = (context: CallableContext): AuthData => {
    // Authentication / user information is automatically added to the request.
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.',
        )
    } else {
        return context.auth
    }
}

export const throwIfUnauthenticatedRequest = async (req: functions.https.Request): Promise<AuthData> => {
    // Get the authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated'
        )
    }

    // Extract the token
    const idToken = authHeader.split('Bearer ')[1]

    // Verify the token using Firebase Admin SDK
    const decodedToken = await auth().verifyIdToken(idToken)

    // Now you have access to the user’s auth context
    const uid = decodedToken.uid

    return { uid, token: decodedToken }
}
