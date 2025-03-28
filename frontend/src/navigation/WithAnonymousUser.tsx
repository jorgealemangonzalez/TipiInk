import { ReactNode, useEffect } from 'react'

import mixpanel from 'mixpanel-browser'

import { useAuth } from '@/auth'
import { AuthenticatedProviders } from '@/auth/providers.tsx'

import { Sentry } from '../sentry.ts'

export const WithAnonymousUser = ({ children, userType }: { children: ReactNode; userType: string }) => {
    console.log('WithAnonymousUser', { children, userType })
    const { isLoadingUser, anonymousSignIn, isLoggedIn } = useAuth()

    useEffect(() => {
        const signIn = async () => {
            if (!isLoadingUser && !isLoggedIn) {
                const user = await anonymousSignIn()
                mixpanel.identify(user.uid)
                mixpanel.people.set({
                    'User ID': user.uid,
                    type: userType,
                    $created: new Date(),
                })
                Sentry.setUser({ id: user.uid })
            }
        }
        signIn()
    }, [isLoadingUser, anonymousSignIn, isLoggedIn, userType])

    if (isLoggedIn) return <AuthenticatedProviders>{children}</AuthenticatedProviders>
}
