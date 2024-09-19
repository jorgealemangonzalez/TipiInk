import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {onSubscriptionUpdate} from '@/old/stripe/DuplicatedFromLibrary.ts'
import {stripePayments} from '@/old/stripe/payments.ts'
import {useAuth} from '../../auth/auth.tsx'
import {Subscription} from '@invertase/firestore-stripe-payments/lib/subscription'
import {ChatBotSubscription} from '@/old/chat/types.ts'
import {doc, getDoc} from 'firebase/firestore'
import {firestore} from '@/firebase/firebase.ts'
import {StripeProduct} from '../../../../backend/functions/src/types/StripePayments'

interface SubscriptionsContextType {
    isLoadingSubscriptions: boolean
    subscriptions: Subscription[]
    isSubscribed: boolean
    isLoadingChatBotSubscriptions: boolean
    chatBotSubscriptions: ChatBotSubscription[]
}

export const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined)

export const useSubscriptions = () => {
    const context = useContext(SubscriptionsContext)
    if (context === undefined) {
        throw new Error('useSubscriptions must be used within a SubscriptionsProvider')
    }
    return context
}

export const isSubscribedToChatBot = (chatBotId: string, chatBotSubscriptions: ChatBotSubscription[]) => {
    console.log({chatBotSubscriptions})
    return chatBotSubscriptions.some((sub) => sub.status === 'active' && sub.chatBotConfig === chatBotId)
}

export const SubscriptionsProvider = ({children}: { children: ReactNode }) => {
    const {user, isLoadingUser} = useAuth()
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [chatBotSubscriptions, setChatBotSubscriptions] = useState<ChatBotSubscription[]>([])
    // const [isSubscribed, setIsSubscribed] = useState<boolean>(true)
    const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState<boolean>(true)
    const [isLoadingChatBotSubscriptions, setIsLoadingChatBotSubscriptions] = useState<boolean>(true)

    useEffect(() => {
        if (!user && !isLoadingUser) setIsLoadingSubscriptions(false)
        if (user) {
            console.log({
                user
            })
            setIsLoadingSubscriptions(true)
            onSubscriptionUpdate(stripePayments.customersCollection, user.uid, (subscriptionSnapshot) => {
                setSubscriptions(subscriptionSnapshot.subscriptions)
                // setIsSubscribed(
                //     subscriptionSnapshot.subscriptions.some((sub) => sub.status === 'active'),
                // )
                setIsLoadingSubscriptions(false)
            }, (error) => {
                console.error('Error updating user subscription:', error)
                setIsLoadingSubscriptions(false)
            })

            onSubscriptionUpdate('stripe_connect_customers', user.uid, (subscriptionSnapshot) => {
                setChatBotSubscriptions(subscriptionSnapshot.subscriptions as ChatBotSubscription[])
                setIsLoadingChatBotSubscriptions(false)
            }, (error) => {
                console.error('Error updating chat bot subscription:', error)
                setIsLoadingChatBotSubscriptions(false)
            })
        }
    }, [user, isLoadingUser])

    const state = {
        subscriptions,
        chatBotSubscriptions,
        isSubscribed: true,
        isLoadingSubscriptions,
        isLoadingChatBotSubscriptions
    }

    return (
        <SubscriptionsContext.Provider value={state}>
            {children}
        </SubscriptionsContext.Provider>
    )
}
