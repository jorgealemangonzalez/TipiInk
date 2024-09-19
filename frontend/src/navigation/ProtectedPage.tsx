import {Navigate} from 'react-router-dom'
import {useAuth} from '@/auth/auth.tsx'
import {ReactNode} from 'react'
import {NavigationBar} from './NavigationBar.tsx'
import {useSubscriptions} from '@/old/contexts/subscriptions.tsx'
import {AuthenticatedProviders} from '@/auth/providers.tsx'

export const ProtectedPage = ({ children }: { children: ReactNode }) => {
    const { user, isLoadingUser } = useAuth()
    const { isSubscribed, isLoadingSubscriptions } = useSubscriptions()

    if(isLoadingUser || isLoadingSubscriptions) return null

    if (!user || !isSubscribed) {
        return <Navigate to="/login" />
    }


    return <AuthenticatedProviders>
        <NavigationBar/>
        <div className="page">
            {children}
        </div>
    </AuthenticatedProviders>
}
