import GoogleButton from 'react-google-button'
import {useEffect, useState} from 'react'
import {RedirectingToCheckout} from '@/old/components/RedirectingToCheckout.tsx'
import mixpanel from 'mixpanel-browser'
import {useAuth} from '@/auth/auth.tsx'
import {useTranslation} from 'react-i18next'
import {Navigate} from "react-router-dom"

function LoginButton(props: { onClick: () => Promise<void> }) {
    const {t} = useTranslation()

    useEffect(() => {
        mixpanel.track_links('#email-link', 'Link Clicked', {linkId: 'email-link'})
        mixpanel.track_links('#email-link', 'Link Clicked', {linkId: 'phone-link'})
    }, [])

    return <div className="flex h-full justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center text-primary mb-4">{t('welcome.to.tipi', 'Welcome to Tipi')}</h1>
            <p className="text-center text-gray-600 mb-6">{t('sign.in.with.google', 'Please sign in with your google account to start creating your chatbots')}</p>

            <iframe id="lottie-iframe" className="h-[15rem] mb-6 hidden"
                src="https://lottie.host/embed/05a3f4dd-3821-449e-9a15-18c4a6764fc0/ql3slmjXf7.json"
                onLoad={() => document.getElementById('lottie-iframe')!.classList.remove('hidden')}
            />
            <GoogleButton onClick={props.onClick}/>
            <span className="text-gray-600 text-xs mt-2">{t('need.help', 'If you need help:')}&nbsp;
                <a id="email-link" href="mailto:botwhirl@gmail.com"
                    className="text-violet-800 underline">botwhirl@gmail.com</a>
                &nbsp; - &nbsp;
                <a id="phone-link" href="https://wa.me/+34677166464"
                    className="text-violet-800 underline">+34677166464</a>
            </span>
        </div>
    </div>
}

export const LoginPage = () => {
    const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false)
    const {googleSignIn, user} = useAuth()
    // const selectedPrice = useQuery('price') ?? DEFAULT_PRICE_99

    const handleLogin = async () => {
        try {
            mixpanel.track('Button Clicked', {button_id: 'google-login'}, {send_immediately: true})
            await googleSignIn()
        } catch (error) {
            console.error('Error logging in:', error)
            setIsRedirectingToCheckout(false)
        }
    }

    if (user && !user.isAnonymous) {
        return <Navigate to="/"/>
    }

    return (
        <>
            {
                isRedirectingToCheckout ?
                    <RedirectingToCheckout/>
                    :
                    <LoginButton onClick={handleLogin}/>
            }
        </>
    )
}
