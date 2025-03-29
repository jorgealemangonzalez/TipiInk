const admin = require('firebase-admin')
const { GoogleAuth } = require('google-auth-library')
const { getConfig } = require('../config')
const { FieldValue } = require('firebase-admin/firestore')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

let isAppInitialized = false
let firestore = undefined
let auth = undefined

const initializeApp = () => {
    if (!isAppInitialized) {
        console.log('Initializing Firebase app...')

        // Load environment variables from the backend
        const backendPath = path.join(process.cwd(), '..', 'backend', 'functions')

        if (!getConfig().prod) {
            console.log('Using local emulators...')
            process.env.IS_SCRIPTS_LOCAL_ENV = true
            process.env.FIRESTORE_EMULATOR_HOST = 'localhost:5003'
            process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:5004'

            // Load local environment variables
            const localEnvPath = path.join(backendPath, '.env.local')
            if (fs.existsSync(localEnvPath)) {
                console.log(`Loading environment variables from ${localEnvPath}`)
                dotenv.config({ path: localEnvPath })
            }
        } else {
            process.env.IS_SCRIPTS_PROD_ENV = true

            // Load production environment variables
            const prodEnvPath = path.join(backendPath, '.env')
            if (fs.existsSync(prodEnvPath)) {
                console.log(`Loading environment variables from ${prodEnvPath}`)
                dotenv.config({ path: prodEnvPath })
            }
        }

        admin.initializeApp({
            projectId: 'tipi-ink',
            credential: admin.credential.applicationDefault(), // To make it work: gcloud auth application-default login
        })

        isAppInitialized = true
    }
}

const getFirestoreInstance = () => {
    if (!firestore) {
        console.log('Initializing Firestore instance...')
        initializeApp()
        firestore = admin.firestore()
    }

    return firestore
}

const getAuthInstance = () => {
    if (!auth) {
        console.log('Initializing Auth instance...')
        initializeApp()
        auth = admin.auth()
    }
    return auth
}

const getAccessToken = async () => {
    const googleAuth = new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'], // Adjust the scope as needed
    })

    const client = await googleAuth.getClient()

    return client.getAccessToken()
}

module.exports = {
    getFirestoreInstance,
    getAccessToken,
    getAuthInstance,
    initializeApp,
    FieldValue,
}
