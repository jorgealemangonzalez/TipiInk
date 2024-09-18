import {createCheckoutSession} from '../../stripe/CreateCheckoutBugFix.ts'
import {isTestEnvironment} from '../../environment.ts'
import {PriceIdSessionCreateParams} from '@invertase/firestore-stripe-payments'

export const DEFAULT_PRICE_99 = isTestEnvironment ? 'price_1PpSzRE1qIe1Fqmtp5EdghX3' : 'price_1PpTHHE1qIe1Fqmt7E0UNr22'
export const PROMOTION_CODE = isTestEnvironment ? 'promo_1PpTDhE1qIe1FqmtjnQHGYIn' : 'promo_1PpTIJE1qIe1FqmtKR19p8KY'
export const goCheckout = async (userId: string, price: string) => {

    // Create a new checkout session
    const checkoutParams: PriceIdSessionCreateParams = {
        price,
        mode: 'subscription',
        success_url: window.location.origin,
        cancel_url: window.location.href,
    }

    if (price === DEFAULT_PRICE_99)
        checkoutParams.promotion_code = PROMOTION_CODE


    const session = await createCheckoutSession(userId, checkoutParams)
    // Redirect to the Stripe Checkout page
    window.location.assign(session.url)
}
