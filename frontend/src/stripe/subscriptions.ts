import {getSubscriptions} from './DuplicatedFromLibrary.ts'
import {and, collection, getDocs, query, where} from "firebase/firestore"
import {firestore} from "../firebase/firebase.ts"

export const hasActiveSubscription = async (userId: string) => {
    const subscriptions = await getSubscriptions(userId, {status: ['active']})
    return subscriptions.length > 0
}

export const hasActiveChatBotSubscription = async (userId: string, chatBotId: string) => {
    const activeSubscriptions = await getDocs(query(
        collection(firestore, 'stripe_connect_customers', userId, 'subscriptions'),
        and(where('status', '==', 'active'),
            where('chatBotConfig', '==', 'chatbot_configs/' + chatBotId)
        ),
    ))

    return !activeSubscriptions.empty
}
