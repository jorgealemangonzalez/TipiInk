import {https, logger} from 'firebase-functions'
import {
    StripeConnectAccount,
    StripeConnectAccountRequest,
    StripeConnectAccountResponse,
} from '../../types/StripeConnect'
import {throwIfUnauthenticated} from '../../../auth/throwIfUnauthenticated'
import {stripe} from '../../api/Stripe'
import {AuthData} from 'firebase-functions/lib/common/providers/https'
import {getStripeAccountByUserId} from '../../db/StripeAccountsDAO'

export const getOrCreateStripeAccount = async (authData: AuthData): Promise<StripeConnectAccount> => {
    const stripeAccountDocRef = getStripeAccountByUserId(authData.uid)

    if (!(await stripeAccountDocRef.get()).exists) {
        const account = await stripe.accounts.create({
            type: 'standard', // See https://docs.stripe.com/connect/accounts
            email: authData.token.email,
        })
        await stripeAccountDocRef.set({
            id: authData.uid,
            stripeAccountId: account.id,
        })
        logger.info('Account created: ', account.id)
    }

    return (await stripeAccountDocRef.get()).data() as StripeConnectAccount
}

export const stripeConnectAccount = https.onCall(
    async (request: StripeConnectAccountRequest, context): Promise<StripeConnectAccountResponse> => {
        const authData = throwIfUnauthenticated(context)
        const connectAccount = await getOrCreateStripeAccount(authData)

        const accountLink = await stripe.accountLinks.create({
            account: connectAccount.stripeAccountId,
            return_url: `${request.returnUrl}`,
            refresh_url: `${request.refreshUrl}`,
            type: 'account_onboarding',
        })
        logger.info('Account link created: ', accountLink.url)

        return {connectUrl: accountLink.url}
    },
)
