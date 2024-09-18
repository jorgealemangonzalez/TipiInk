export interface StripeConnectAccountResponse {
    connectUrl: string
}

export interface StripeConnectAccountRequest {
    returnUrl: string
    refreshUrl: string
}

export interface StripeConnectAccount {
    id: string
    stripeAccountId: string
    chargesEnabled?: boolean
}
