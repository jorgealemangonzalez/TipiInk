import {firestore} from '../../FirebaseInit'
import {Timestamp} from 'firebase-admin/firestore'
import {logger} from 'firebase-functions'
import {InitTestAssistantRequest} from '../types/TestAssistant'

interface BotWhirlUsage {
    messagesContent: number
    createdAssistants: number
    deployments: number
    checkoutSessions: number
    since: Timestamp
}

const defaultUsage: Omit<BotWhirlUsage, 'since'> = {
    messagesContent: 0,
    createdAssistants: 0,
    deployments: 0,
    checkoutSessions: 0,
}

const dailyLimits = {
    totalSentMessagesContentLength: 1_000_000,
    totalCreatedAssistants: 100,
    totalDeployments: 1000,
    totalCheckoutSessions: 100,
}

const usageCollection = firestore.collection('usage')

function moreThan24hAgo(since: Timestamp) {
    return since.toMillis() < Timestamp.now().toMillis() - 24 * 60 * 60 * 1000
}

async function resetUsage(
    usageRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>
) {
    await usageRef.set({
        ...defaultUsage,
        since: Timestamp.now(),
    })
}

const getUsage = async (uid: string) => {
    const usageRef = usageCollection.doc(uid)
    const usageSnapshot = await usageRef.get()
    if (!usageSnapshot.exists) {
        await resetUsage(usageRef)
    } else {
        const currentUsage = usageSnapshot.data()!
        // If the last usage was more than 24 hours ago, reset the usage
        if (moreThan24hAgo(currentUsage.since)) {
            await resetUsage(usageRef)
        }
    }
    return (await usageRef.get()).data() as BotWhirlUsage
}

export const limitChatMessagesUsage = async (uid: string, message: string) => {
    const currentUsage = await getUsage(uid)

    if (currentUsage.messagesContent + message.length >= dailyLimits.totalSentMessagesContentLength) {
        logger.error('Daily message limit reached', {uid, currentUsage})
        throw new Error('Daily message limit reached')
    }

    await usageCollection.doc(uid).update({
        messagesContent: currentUsage.messagesContent + message.length,
    })
}

export const limitTestAssistantCreation = async (uid: string, request: InitTestAssistantRequest) => {
    const currentUsage = await getUsage(uid)

    if (currentUsage.createdAssistants >= dailyLimits.totalCreatedAssistants) {
        logger.error('Daily assistant creation limit reached', {uid, currentUsage})
        throw new Error('Daily assistant creation limit reached')
    }

    if (request.assistantPrompt.length >= 1_000_000) {
        logger.error('Initial assistant prompt too long', {uid, currentUsage})
        throw new Error('Initial assistant prompt too long')
    }

    await usageCollection.doc(uid).update({
        createdAssistants: currentUsage.createdAssistants + 1,
    })
}

export const limitDeployments = async (uid: string) => {
    const currentUsage = await getUsage(uid)

    if (currentUsage.deployments >= dailyLimits.totalDeployments) {
        logger.error('Daily deployment limit reached', {uid, currentUsage})
        throw new Error('Daily deployment limit reached')
    }

    await usageCollection.doc(uid).update({
        deployments: currentUsage.deployments + 1,
    })
}

export const limitEndCustomersCheckoutSessions = async (uid: string) => {
    const currentUsage = await getUsage(uid)

    if (currentUsage.checkoutSessions >= dailyLimits.totalCheckoutSessions) {
        logger.error('Daily checkout session limit reached', {uid, currentUsage})
        throw new Error('Daily checkout session limit reached')
    }

    await usageCollection.doc(uid).update({
        checkoutSessions: currentUsage.checkoutSessions + 1,
    })
}
