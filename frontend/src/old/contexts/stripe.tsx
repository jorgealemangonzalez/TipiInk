import {createContext, ReactNode, useContext} from 'react'
import {useUser} from '../../auth/auth.tsx'
import {StripeConnectAccount} from '../../../../backend/functions/src/types/StripeConnect'
import {useDocument} from '@/firebase/hooks/useDocument.ts'

type StripeContextType = {
    stripeAccount?: StripeConnectAccount
    hasStripeAccountWithEnabledCharges: boolean
}

export const StripeContext = createContext<StripeContextType | undefined>(undefined)

export const useStripeContext = () => {
    const context = useContext(StripeContext)
    if (context === undefined) {
        throw new Error('useStripeContext must be used within a StripeProvider')
    }
    return context
}

export const StripeProvider = ({children}: { children: ReactNode }) => {
    const user = useUser()
    const {document: stripeAccount} =
        useDocument<StripeConnectAccount>({
            collectionName: 'stripe_accounts',
            id: user.uid,
        })

    console.log('user' ,user.uid)
    console.log('account', stripeAccount)

    const hasStripeAccountWithEnabledCharges = stripeAccount?.chargesEnabled === true
    return <StripeContext.Provider value={{stripeAccount, hasStripeAccountWithEnabledCharges}}>
        {children}
    </StripeContext.Provider>
}
