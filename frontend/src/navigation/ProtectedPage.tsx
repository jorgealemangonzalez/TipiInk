import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '@/auth/auth.tsx'
import { AuthenticatedProviders } from '@/auth/providers.tsx'

export const ProtectedPage = ({ children }: { children: ReactNode }) => {
    const { user, isLoadingUser } = useAuth()

    if (!user && !isLoadingUser) {
        return <Navigate to='/login' />
    }

    return (
        <AuthenticatedProviders>
            <div className='page'>{children}</div>
        </AuthenticatedProviders>
    )
}
