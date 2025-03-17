import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp(
    {
        projectId: 'tipi-ink',
        storageBucket: 'tipi-ink.appspot.com',
    }
)

export const isLocalEnvironment = () => {
    return process.env.FUNCTIONS_EMULATOR === 'true'
}

export const firestore = admin.firestore()

export const storage = admin.storage()

functions.setGlobalOptions({ region: 'europe-west3' })

export const onCallWithSecretKey = <P, R>(handler: (request: functions.https.CallableRequest<P>) => Promise<R>) => {
    return functions.https.onCall(async (request) => {
        const serverSecretKey = process.env.SERVER_SECRET_KEY
        if (!serverSecretKey) {
        throw new functions.https.HttpsError('unauthenticated', 'Server secret key not found')
    }

    if (request.rawRequest.headers['x-server-secret-key'] !== serverSecretKey) {
        throw new functions.https.HttpsError('unauthenticated', 'Invalid server secret key')
    }

        return handler(request)
    })
}

export const onCallUnauthenticated = <P, R>(handler: (request: functions.https.CallableRequest<P>) => Promise<R>) => {
    return functions.https.onCall(async (request) => {
        return handler(request)
    })
}

export interface Request<P> extends functions.https.CallableRequest<P> {
    rawRequest: functions.https.Request
}