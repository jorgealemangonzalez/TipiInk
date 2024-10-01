import {initializeApp} from "firebase/app"
import {connectFunctionsEmulator, getFunctions} from "firebase/functions"
import {
    connectAuthEmulator,
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    Unsubscribe,
} from "firebase/auth"
import {getAnalytics} from "firebase/analytics"
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore'
import {connectStorageEmulator, getStorage} from 'firebase/storage'
import {isLocalEnvironment} from '../environment.ts'


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDsYrBS4X0C36ThgIfyj-AOcG7pq_oSk7s",
    authDomain: "tipi-ink.firebaseapp.com",
    projectId: "tipi-ink",
    storageBucket: "tipi-ink.appspot.com",
    messagingSenderId: "634165171036",
    appId: "1:634165171036:web:981e4bbbd6e5d568f3e799",
    measurementId: "G-CQ57GQBLGJ"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
getAnalytics(firebaseApp)
const functions = getFunctions(firebaseApp)
const firestore = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

// Connect to the emulator if in development
if (isLocalEnvironment) {
    connectAuthEmulator(auth, `http://${window.location.hostname}:5004`)
    connectFunctionsEmulator(functions, window.location.hostname, 5001)
    connectFirestoreEmulator(firestore, window.location.hostname, 5003)
    connectStorageEmulator(storage, window.location.hostname, 5005)
}

type OnAuthStateChangedParams = Parameters<typeof firebaseOnAuthStateChanged>

const onAuthStateChanged =
    (callback: OnAuthStateChangedParams[1]): Unsubscribe =>
        firebaseOnAuthStateChanged(auth, callback)
export {
    auth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    functions,
    firebaseApp,
    onAuthStateChanged,
    firestore,
    storage,
}
