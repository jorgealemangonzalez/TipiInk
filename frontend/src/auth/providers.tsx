import { ReactNode } from 'react'

import { AuthProvider } from './auth.tsx'

export const UnauthenticatedProviders = ({ children }: { children: ReactNode }) => {
    return <AuthProvider>{children}</AuthProvider>
}

export const AuthenticatedProviders = ({ children }: { children: ReactNode }) => {
    return children
}
