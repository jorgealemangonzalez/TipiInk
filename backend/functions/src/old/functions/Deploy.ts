import {https, logger} from 'firebase-functions'
import {DeployRequest, DeployResponse} from '../types/Deploy'
import {throwIfUnauthenticated} from '../../auth/throwIfUnauthenticated'
import {getOrThrowChatbotConfig, updateChatbotConfig} from '../db/ChatBotConfigDAO'
import {getInitialAssistantMessage, getOrThrowChat} from '../db/ChatDAO'
import {stripe} from '../api/Stripe'
import {getOrThrowStripeAccountByUserId} from '../db/StripeAccountsDAO'
import {ChatBotConfig, TestChat} from '../types/ChatBotConfig'
import {limitDeployments} from '../usage/UsageLimits'
import {trackEvent} from '../api/tracking'

const toDecimal = (price: number) => Number(price.toFixed(2)) * 100

async function createStripeProduct(uid: string, chatbotConfig: ChatBotConfig) {
    logger.info('Creating stripe product for chatbot', chatbotConfig)
    const account = await getOrThrowStripeAccountByUserId(uid)
    return await stripe.products.create({
        name: 'Chatbot subscription',
        description: 'Monthly subscription for the chatbot service',
        default_price_data: {
            currency: 'eur',
            unit_amount_decimal: toDecimal(chatbotConfig.price!).toString(),
            recurring: {
                interval: 'month',
                interval_count: 1,
            },
        },
        metadata: {
            chatBotId: chatbotConfig.id,
        },
    }, {
        stripeAccount: account.stripeAccountId,
    })
}

const priceChangedSinceLastDeploy = async (chatbotConfig: ChatBotConfig, stripeAccount: string) => {
    const currentStripePrice = await stripe.prices.retrieve(chatbotConfig.stripePriceId!, {}, {stripeAccount})
    return currentStripePrice.unit_amount != chatbotConfig.price! * 100
}

async function updateStripeProduct(chatbotConfig: ChatBotConfig, uid: string) {
    logger.info('Updating stripe product for chatbot', chatbotConfig)
    const stripeAccount = (await getOrThrowStripeAccountByUserId(uid)).stripeAccountId

    logger.info('Updating stripe price for chatbot', chatbotConfig)
    const stripePrice = await stripe.prices.create({
        currency: 'eur',
        unit_amount_decimal: toDecimal(chatbotConfig.price!).toString(),
        product: chatbotConfig.stripeProductId,
        recurring: {
            interval: 'month',
            interval_count: 1,
        },
    }, {
        stripeAccount,
    })

    return await stripe.products.update(chatbotConfig.stripeProductId!,
        {default_price: stripePrice.id},
        {stripeAccount},
    )
}

const getOrUpdateStripeProduct = async (uid: string): Promise<{
    stripeProductId: string;
    price: number;
    stripePriceId: string
}> => {
    const chatbotConfig = await getOrThrowChatbotConfig(uid)
    const stripeAccount = (await getOrThrowStripeAccountByUserId(uid)).stripeAccountId

    if (chatbotConfig.stripeProductId) {
        if (await priceChangedSinceLastDeploy(chatbotConfig, stripeAccount)) {
            const product = await updateStripeProduct(chatbotConfig, uid)
            return {
                stripeProductId: product.id,
                stripePriceId: product.default_price as string,
                price: chatbotConfig.price!,
            }
        } else {
            return {
                stripeProductId: chatbotConfig.stripeProductId,
                stripePriceId: chatbotConfig.stripePriceId!,
                price: chatbotConfig.price!,
            }
        }
    } else {
        const product = await createStripeProduct(uid, chatbotConfig)
        return {
            stripeProductId: product.id,
            stripePriceId: product.default_price as string,
            price: chatbotConfig.price!,
        }
    }
}

export const deploy = https.onCall(
    async (_: DeployRequest, context): Promise<DeployResponse> => {
        const {uid} = throwIfUnauthenticated(context)
        logger.info('Deploying chatbot', {uid})
        await limitDeployments(uid)

        const {stripeProductId, stripePriceId, price} = await getOrUpdateStripeProduct(uid)

        const config = await getOrThrowChatbotConfig(uid)
        if (!config.testChatId) {
            throw new Error('Test chat not found, please create a test chat before deploying the chatbot')
        }

        const chat = await getOrThrowChat(config.testChatId) as TestChat
        logger.info('Deploying test assistant for chat', chat.id)
        const initialAssistantMessage = await getInitialAssistantMessage(chat.id)

        await updateChatbotConfig(uid, {
            stripeProductId,
            stripePriceId,
            deployedAssistantId: chat.testAssistantId,
            initialAssistantMessage: initialAssistantMessage.content,
            testingOpenaiVectorStoreId: null,
        })

        await trackEvent(uid, 'ChatBot deployed', {
            chatBotId: uid,
            chatId: chat.id,
            assistantId: chat.testAssistantId,
            price: price,
        })
    })
