import {useQuery} from '../../navigation/navigationHooks.ts'
import {DEFAULT_PRICE_99, goCheckout} from './GoCheckout.tsx'
import {useEffect} from 'react'
import {useUser} from '../../contexts/auth.tsx'
import {RedirectingToCheckout} from '../../components/RedirectingToCheckout.tsx'
import mixpanel from 'mixpanel-browser'

export const RedirectToCheckout = () => {
    const user = useUser()
    const selectedPrice = useQuery('price') ?? DEFAULT_PRICE_99

    useEffect(() => {
        mixpanel.track('User redirected to checkout', {price: selectedPrice}, {send_immediately: true})
        goCheckout(user.uid, selectedPrice)
    }, [])

    return <RedirectingToCheckout/>
}
