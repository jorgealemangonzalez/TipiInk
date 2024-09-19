import {ReactNode} from 'react'
import {SubscriptionsProvider} from '../old/contexts/subscriptions.tsx'
import {StripeProvider} from '../old/contexts/stripe.tsx'
import {ChatBotConfigProvider} from '../old/contexts/ChatBotConfig.tsx'
import {AuthProvider} from './auth.tsx'

export const UnauthenticatedProviders = ({children}: {children: ReactNode}) => {
    return <AuthProvider>
        <SubscriptionsProvider>
            {children}
        </SubscriptionsProvider>
    </AuthProvider>
}

export const AuthenticatedProviders = ({children}: {children: ReactNode}) => {
    return <StripeProvider>
        <ChatBotConfigProvider>
            {children}
        </ChatBotConfigProvider>
    </StripeProvider>
}
