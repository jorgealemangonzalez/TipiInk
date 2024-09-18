import {ReactNode} from 'react'
import {SubscriptionsProvider} from './subscriptions.tsx'
import {StripeProvider} from './stripe.tsx'
import {ChatBotConfigProvider} from './ChatBotConfig.tsx'
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
