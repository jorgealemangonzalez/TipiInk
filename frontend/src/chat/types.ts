import {Subscription} from '@invertase/firestore-stripe-payments/lib/subscription'

export type ChatBotSubscription = Subscription & { chatBotConfig: string }
