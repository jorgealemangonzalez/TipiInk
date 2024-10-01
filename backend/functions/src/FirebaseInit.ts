import * as admin from 'firebase-admin'

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
