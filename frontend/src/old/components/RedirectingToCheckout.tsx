import {DotLottiePlayer} from "@dotlottie/react-player"
import {useTranslation} from "react-i18next"

export const RedirectingToCheckout = () => {
    const {t} = useTranslation()
    return <div className="flex h-full justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center">
            <h1 className="text-center text-primary mb-4">{t('checkout.redirect', 'Redirecting to checkout...')}</h1>
            <DotLottiePlayer src="/redirecting-paper-plane.lottie" autoplay loop/>
        </div>
    </div>
}
