import {PublishSection} from './sections/PublishSection.tsx'
import {PricingSection} from './sections/PriceSection.tsx'
import {useChatBotConfig} from '@/old/contexts/ChatBotConfig.tsx'
import {QuestionMarkCircleIcon} from '@heroicons/react/24/outline'
import {useWindowBreakpoint} from '@/old/react/breakpoints.ts'
import {useTranslation} from "react-i18next"

export const PublishPage = () => {
    const {config, setConfig} = useChatBotConfig()
    const {isLgOrBigger} = useWindowBreakpoint()
    const {t} = useTranslation()
    const setPrice = (price: number | undefined) => setConfig({...config, price})

    return <div className="flex justify-center items-center px-4">
        <div className="flex-col space-y-8 max-w-[50rem] pb-4">
            <PricingSection price={config?.price} setPrice={setPrice}/>
            <PublishSection config={config}/>

            <div role="alert" className="alert alert-info">
                {isLgOrBigger && <QuestionMarkCircleIcon className="h-6 w-6 shrink-0 stroke-2"/>}
                <span>{t('contact_us', 'If you have any questions you can contact us by:')} &nbsp;
                    <a href="mailto:botwhirl@gmail.com" className="text-violet-800 underline">Email (botwhirl@gmail.com)</a>
                    &nbsp; or &nbsp;
                    <a href="https://wa.me/+34677166464" className="text-violet-800 underline">WhatsApp</a>
                </span>

            </div>
        </div>
    </div>

}
