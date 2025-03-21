import React, { useEffect, useState } from 'react'

import { signInAnonymously } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import mixpanel from 'mixpanel-browser'

import { isLocalEnvironment } from '@/environment.ts'
import { GoogleAuthProvider, auth, firestore, onAuthStateChanged, signInWithPopup } from '@/firebase/firebase.ts'

import { Sentry } from '../sentry.ts'
import { AuthContext, AuthContextType, User } from './auth-helpers.ts'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>()
    const [isLoading, setIsLoading] = useState<boolean>(true) // TODO MAYBE HAVING 2 SEPARATE STATES GENERATES RACE CONDITIONS
    const isLoggedIn = user !== undefined

    console.log({ user })

    useEffect(
        () =>
            onAuthStateChanged(async newUser => {
                if (newUser) {
                    console.log('User logging in: ', { newUser })
                    const token = await newUser.getIdTokenResult()
                    // @ts-expect-error adding custom property to user.
                    //  Using it this way to avoid losing the methods of the user object
                    newUser.isAdmin = !!token.claims.admin

                    const userSnapshot = await getDoc(doc(firestore, 'users', newUser.uid))
                    // @ts-expect-error adding custom property to user.
                    //  Using it this way to avoid losing the methods of the user object
                    newUser.companyId = userSnapshot.exists() ? userSnapshot.data()!.companyId : 'default'

                    setUser(newUser as User)
                    mixpanel.identify(newUser.uid)
                    mixpanel.people.set({
                        'User ID': newUser.uid,
                        type: 'customer',
                        $email: newUser.email,
                        $name: newUser.displayName,
                        $phone: newUser.phoneNumber,
                        $avatar: newUser.photoURL,
                        $created: new Date(),
                    })
                    Sentry.setUser({
                        id: newUser.uid,
                        email: newUser.email || undefined,
                        username: newUser.displayName || undefined,
                    })
                    console.log('User logged in: ', { authData: await newUser.getIdTokenResult(true) })
                } else setUser(undefined)
                setIsLoading(false)
            }),
        [],
    )

    const anonymousSignIn = async (): Promise<User> => {
        setIsLoading(true)
        return await signInAnonymously(auth)
            .then(
                (credentials): User => ({
                    ...credentials.user,
                    isAdmin: false,
                    companyId: 'default',
                }),
            )
            .finally(() => setIsLoading(false))
    }

    const googleSignIn = async () => {
        const googleAuthProvider = new GoogleAuthProvider()
        if (!isLocalEnvironment) googleAuthProvider.addScope('https://www.googleapis.com/auth/spreadsheets')
        await signInWithPopup(auth, googleAuthProvider)
        console.log('Google sign in successful')
    }

    const value: AuthContextType = {
        anonymousSignIn,
        googleSignIn,
        user,
        isLoggedIn,
        isLoadingUser: isLoading,
    }

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}
