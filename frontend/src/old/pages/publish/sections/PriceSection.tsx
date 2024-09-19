import {stripeConnectAccount} from '@/old/api/clients.ts'
import {useStripeContext} from '@/old/contexts/stripe.tsx'
import {ArrowTopRightOnSquareIcon} from '@heroicons/react/24/outline'
import {useEffect, useState} from 'react'
import mixpanel from 'mixpanel-browser'
import {useTranslation} from "react-i18next"

type PriceInputProps = {
    setPrice: (price?: number) => void
    price?: number
    enabled?: boolean
}

function PriceInput({setPrice, price, enabled}: PriceInputProps) {
    const {t} = useTranslation()

    const setCleanedPrice = (newPrice: string) => {
        console.log('newPrice', newPrice)
        if (newPrice === '') {
            setPrice(undefined)
            return
        }

        const parts = newPrice.split('.')

        let newPriceNumber

        if (parts.length > 1 && parts[1].length > 2) {
            // Use toFixed to round to 2 decimal places and convert back to float
            newPriceNumber = parseFloat(parseFloat(newPrice).toFixed(2))
        } else {
            newPriceNumber = parseFloat(newPrice)
        }

        if(newPriceNumber <= 0) {
            setPrice(undefined)
            return
        }

        setPrice(newPriceNumber)
    }

    return <div>
        <h3>{t('pricing', 'Pricing')}</h3>
        <p>{t('pricing.description', 'Set the price that each of your customers will pay for accessing the chatbot')}</p>
        <div className="w-36 pt-1">
            <label className="input input-bordered flex items-center gap-2">
                €
                <input
                    type="number"
                    className="w-full"
                    placeholder={enabled ? '19.99' : '0'}
                    step="0.01"
                    value={price ?? ''}
                    onChange={(e) => setCleanedPrice(e.target.value)}
                    disabled={!enabled}
                />
            </label>
        </div>
    </div>
}

function PriceBreakdown({price}: { price: number }) {
    const tipiFee = price * 0.1 < 5 ? 5 : price * 0.1
    const {t} = useTranslation()

    return <div className="flex flex-col text-sm space-y-1">
        <div className="flex flex-row place-content-between">
            <b>{t('price.user.month', 'Price user/month')}</b>
            {price}€
        </div>
        <div className="flex flex-row place-content-between">
            <div>
                <b>{t('stripe.fee', 'Stripe fee')}</b> (3.25%+0.25€)
            </div>
            {(price * 0.0325 + 0.25).toFixed(2)}€
        </div>
        <div className="flex flex-row place-content-between border-b-[1px] border-neutral">
            <div>
                <b>{t('tipi.fee', 'Tipi fee')}</b> (10% / 5€)
            </div>
            {tipiFee}€
        </div>
        <div className="flex flex-row place-content-between">
            <b>{t('revenue.user.month', 'Revenue per user/month')}</b>
            <b>{(price - price * 0.025 - 0.25 - tipiFee).toFixed(2)}€</b>
        </div>
    </div>
}

interface ConnectStripeProps {
    hasStripeAccountWithEnabledCharges: boolean
}

function StripeAccount({hasStripeAccountWithEnabledCharges}: ConnectStripeProps) {
    const [isRedirectingToConnect, setIsRedirectingToConnect] = useState(false)
    const {t} = useTranslation()

    const connect = async () => {
        setIsRedirectingToConnect(true)
        mixpanel.track('User redirected to stripe connect')
        const response = await stripeConnectAccount({
            refreshUrl: window.location.href + '?stripe=refresh',
            returnUrl: window.location.href + '?stripe=success',
        })
        window.location.assign(response.data.connectUrl)
    }

    useEffect(() => {
        mixpanel.track_links('#open-stripe-platform', 'Open Stripe Platform')
    }, [])

    return <div className="flex flex-row place-content-between">
        {hasStripeAccountWithEnabledCharges ?
            <div className='flex flex-col lg:flex-row gap-2 items-center'>
                <div>
                    <b>{t('stripe.account.linked', 'Stripe account linked')}</b>
                    <p>{t('stripe.account.connected.description', 'Your Stripe account is connected, you can check your earnings and configuration in stripe platform')}</p>
                </div>
                <a className="btn btn-primary" id="open-stripe-platform" href='https://dashboard.stripe.com/login' target='_blank'>
                    {t('stripe.go.button', 'Go to Stripe')}
                    <ArrowTopRightOnSquareIcon className="size-5 stroke-2"/>
                </a>
            </div>
            :
            <>
                <div>
                    <h3>{t('connect.stripe', 'Connect Stripe')}</h3>
                    <p>{t('connect.stripe.description', 'Connect your Stripe account to start receiving payments')}</p>
                </div>
                {isRedirectingToConnect ?
                    <div className="btn btn-primary">
                        {t('redirecting', 'Redirecting')}
                        <span style={{marginTop: '0.80rem'}} className="loading loading-dots loading-xs"></span>
                    </div>
                    :
                    <button className="btn btn-primary" onClick={connect}>{t('connect', 'Connect')}</button>
                }
            </>
        }
    </div>
}

type PricingSectionProps = {
    price?: number
    setPrice: (value?: number) => void
}

export const PricingSection = ({price, setPrice}: PricingSectionProps) => {
    const {hasStripeAccountWithEnabledCharges} = useStripeContext()
    const {t} = useTranslation()

    return <div className="publish-section">
        <div>
            <h1>{t('payments', 'Payments')}</h1>
        </div>
        <StripeAccount hasStripeAccountWithEnabledCharges={hasStripeAccountWithEnabledCharges}/>
        <PriceInput price={price} setPrice={setPrice} enabled={hasStripeAccountWithEnabledCharges}/>
        {price && price > 0 &&
            <PriceBreakdown price={price}/>
        }
    </div>
}
