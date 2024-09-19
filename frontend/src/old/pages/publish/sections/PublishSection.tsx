import {deploy} from '@/old/api/clients.ts'
import {FireIcon, RocketLaunchIcon} from '@heroicons/react/24/outline'
import {ChatBotConfig} from '../../../../../../backend/functions/src/types/ChatBotConfig'
import {useStripeContext} from '@/old/contexts/stripe.tsx'
import {useState} from 'react'
import {useTranslation} from "react-i18next"

type PublishSectionProps = {
    config: ChatBotConfig
}

export const PublishSection = ({config}: PublishSectionProps) => {
    const {hasStripeAccountWithEnabledCharges} = useStripeContext()
    const isReadyToPublish = config.price && config.testChatId && hasStripeAccountWithEnabledCharges
    const [isPublishing, setIsPublishing] = useState<boolean>(false)
    const [isPublished, setIsPublished] = useState<boolean>(false)
    const {t} = useTranslation()

    const chatBotUrl = `${window.location.origin}/chat?chatBotId=${config.id}`

    const publish = async () => {
        setIsPublishing(true)
        await deploy()
        setIsPublishing(false)
        setIsPublished(true)
        setTimeout(() => setIsPublished(false), 5000)
    }

    return <div className="publish-section">
        <div>
            <h1>{t('publish', 'Publish')}</h1>
            <p>
                {t('publish.explanation', 'Once you publish your chatbot,the new version will be accessible to all your exiting and new users at:')}
                &nbsp;
                <a href={chatBotUrl} className="text-violet-800" target="_blank" rel="noreferrer">
                    {chatBotUrl}
                </a>
            </p>
        </div>
        {
            isPublishing ?
                <div className="btn w-fit btn-primary">
                    {t('chatbot.publishing','Publishing')}
                    <div className="loading loading-dots loading-sm"></div>
                </div> :
                isPublished ?
                    <div className="btn w-fit btn-success">
                        {t('chatbot.state.published','Chatbot published')}
                        <FireIcon className="size-5"/>
                    </div>
                    :
                    <button className="btn w-fit btn-primary"
                        onClick={publish}
                        disabled={!isReadyToPublish}
                    >
                        {t('chatbot.publish.button','Publish chatbot')}
                        <RocketLaunchIcon className="size-5"/>
                    </button>
        }
    </div>
}
