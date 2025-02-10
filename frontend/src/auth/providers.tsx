import { ReactNode } from 'react'
import { ChatBotConfigProvider } from '../old/contexts/ChatBotConfig.tsx'
import { StripeProvider } from '../old/contexts/stripe.tsx'
import { AuthProvider } from './auth.tsx'

export const UnauthenticatedProviders = ({children}: {children: ReactNode}) => {
    return <AuthProvider>
            {children}
    </AuthProvider>
}

export const AuthenticatedProviders = ({children}: {children: ReactNode}) => {
    return <StripeProvider>
        <ChatBotConfigProvider>
            {children}
        </ChatBotConfigProvider>
    </StripeProvider>
}
