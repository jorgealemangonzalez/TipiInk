import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import {
    GoogleAuthProvider,
    Unsubscribe,
    connectAuthEmulator,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    getAuth,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import { connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

import { isLocalEnvironment } from '@/environment'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDsYrBS4X0C36ThgIfyj-AOcG7pq_oSk7s',
    authDomain: 'tipi-ink.firebaseapp.com',
    projectId: 'tipi-ink',
    storageBucket: 'tipi-ink.appspot.com',
    messagingSenderId: '634165171036',
    appId: '1:634165171036:web:981e4bbbd6e5d568f3e799',
    measurementId: 'G-CQ57GQBLGJ',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
getAnalytics(firebaseApp)
const functions = getFunctions(firebaseApp, 'europe-west3')
const firestore = initializeFirestore(firebaseApp, {
    ignoreUndefinedProperties: true,
})
const storage = getStorage(firebaseApp)

// // Connect to the emulator if in development
if (isLocalEnvironment) {
    console.log('Connecting to the emulator')
    connectAuthEmulator(auth, `http://${window.location.hostname}:5004`)
    connectFunctionsEmulator(functions, window.location.hostname, 5008)
    connectFirestoreEmulator(firestore, window.location.hostname, 5003)
    connectStorageEmulator(storage, window.location.hostname, 5005)
}

type OnAuthStateChangedParams = Parameters<typeof firebaseOnAuthStateChanged>

const onAuthStateChanged = (callback: OnAuthStateChangedParams[1]): Unsubscribe =>
    firebaseOnAuthStateChanged(auth, callback)
export {
    GoogleAuthProvider,
    auth,
    firebaseApp,
    firestore,
    functions,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    storage,
}
