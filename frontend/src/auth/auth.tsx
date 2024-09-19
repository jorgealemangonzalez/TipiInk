import React, {createContext, useContext, useEffect, useState} from 'react'
import {signInAnonymously, User as FUser, getAdditionalUserInfo} from 'firebase/auth'
import {auth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from '@/firebase/firebase.ts'
import mixpanel from 'mixpanel-browser'
import {Sentry} from '../sentry.ts'

type User = FUser & { isAdmin: boolean };

interface AuthContextType {
    user?: User
    isLoggedIn: boolean
    isLoadingUser: boolean
    anonymousSignIn: () => Promise<User>
    googleSignIn: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within a UserProvider')
    }
    return context
}

export const useUser = () => {
    const context = useAuth()
    if (context.user === undefined) {
        throw new Error('useUser must be used when authenticated')
    }
    return context.user
}

const waitForGoogleApiToBeReady = async () => {
    return new Promise((resolve) => {
        const checkGapi = () => {
            if (window.gapi) {
                resolve(window.gapi)  // gapi is available, resolve the promise
            } else {
                console.log('Waiting for gapi to be ready...')
                setTimeout(checkGapi, 100)  // Poll every 100ms
            }
        }
        checkGapi() // Start checking for gapi
    })
}

export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>()
    const [isLoading, setIsLoading] = useState<boolean>(true) // TODO MAYBE HAVING 2 SEPARATE STATES GENERATES RACE CONDITIONS
    const isLoggedIn = user !== undefined

    console.log({user})

    useEffect(() => onAuthStateChanged(async (newUser) => {
        if (newUser) {
            console.log('User logging in: ', {newUser})
            const token = await newUser.getIdTokenResult()
            // @ts-expect-error adding custom property to user.
            //  Using it this way to avoid losing the methods of the user object
            newUser.isAdmin = !!token.claims.admin


            const credentials = GoogleAuthProvider.credentialFromResult({
                user: newUser,
                operationType: "signIn",
                providerId: "google.com"
            })
            await waitForGoogleApiToBeReady()
            gapi.client.setToken({access_token: await newUser.getIdTokenResult(true)})

            setUser(newUser as User)
            mixpanel.identify(newUser.uid)
            mixpanel.people.set({
                'User ID': newUser.uid,
                'type': 'customer',
                '$email': newUser.email,
                '$name': newUser.displayName,
                '$phone': newUser.phoneNumber,
                '$avatar': newUser.photoURL,
                '$created': new Date(),
            })
            Sentry.setUser({
                id: newUser.uid,
                email: newUser.email || undefined,
                username: newUser.displayName || undefined,
            })
            console.log('User logged in: ', {authData: await newUser.getIdTokenResult(true)})
        } else setUser(undefined)
        if (isLoading)
            setIsLoading(false)
    }), [])

    const anonymousSignIn = async (): Promise<User> => {
        setIsLoading(true)
        return await signInAnonymously(auth)
            .then((credentials): User => ({
                ...credentials.user,
                isAdmin: false
            }))
            .finally(() => setIsLoading(false))
    }

    const googleSignIn = async () => {
        const googleAuthProvider = new GoogleAuthProvider()
        googleAuthProvider.addScope('https://www.googleapis.com/auth/spreadsheets')
        const credential = await signInWithPopup(auth, googleAuthProvider)
        console.log('credential', {credential})
        const credentials = GoogleAuthProvider.credentialFromResult(credential)
        await waitForGoogleApiToBeReady()
        gapi.client.setToken({access_token: credentials!.accessToken!})
        console.log('Google sign in successful')
    }

    const value: AuthContextType = {
        anonymousSignIn,
        googleSignIn,
        user,
        isLoggedIn,
        isLoadingUser: isLoading
    }

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}
