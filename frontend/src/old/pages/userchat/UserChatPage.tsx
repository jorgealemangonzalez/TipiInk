import {Chat} from '@/old/chat/Chat.tsx'
import {useUser} from '@/auth/auth.tsx'
import {ReactNode, useEffect, useState} from 'react'
import {useQuery} from '@/navigation/navigationHooks.ts'
import {LiveChat} from '../../../../../backend/functions/src/types/ChatBotConfig'
import {createCheckoutSession} from '@/old/stripe/CreateCheckoutBugFix.ts'
import {isSubscribedToChatBot, useSubscriptions} from '@/old/contexts/subscriptions.tsx'
import {startEndUserChat} from '@/old/api/clients.ts'
import mixpanel from 'mixpanel-browser'
import {getActiveLiveChat} from '@/old/chat/ChatDAO.ts'
import {DotLottiePlayer} from '@dotlottie/react-player'
import {useTranslation} from "react-i18next"
import {HamburgerMenu} from '@/old/components/HamburgerMenu.tsx'


const useActiveChat = (uid: string, chatBotId: string) => {
    const [chat, setChat] = useState<LiveChat>()
    const [isCreatingChat, setIsCreatingChat] = useState(false)

    useEffect(() => {
        (async () => {
            if (!chatBotId) return

            const activeChat = await getActiveLiveChat(uid, chatBotId)
            if (activeChat) {
                setChat(activeChat)
            } else {
                setIsCreatingChat(true)
                await startEndUserChat({chatBotId: chatBotId})
                setChat(await getActiveLiveChat(uid, chatBotId))
                setIsCreatingChat(false)
            }
        })()
    }, [uid, chatBotId])

    return {chat, isCreatingChat: !chat && isCreatingChat}
}

export const UserActiveChat = () => {
    const user = useUser()
    const chatBotId = useQuery('chatBotId')
    const {chat, isCreatingChat} = useActiveChat(user.uid, chatBotId!)
    const {t} = useTranslation()

    console.log('UserActiveChat', {user, chatBotId, chat})

    useEffect(() => {
        mixpanel.track_pageview({page: 'End user active chat'})
    }, [])

    if (isCreatingChat) {
        return <div className="flex flex-col items-center justify-center gap-5 h-full bg-main-100">
            <div className="flex flex-col justify-center items-center">
                <h1>
                    {t('creating.assistant', 'Creating your assistant')}
                </h1>
            </div>
            <iframe style={{height: '15rem'}}
                src="https://lottie.host/embed/884575f6-fd02-495d-aa09-b85bb76a1b9b/zZ8P8Kt1Ze.json"/>
        </div>
    }

    return chat &&
        <div className="display bg-main-100 h-full flex flex-col justify-end pb-4 px-4">
            <Chat id={chat.id}/>
        </div>
}

const WithChatBotSubscription = ({children}: { children: ReactNode }) => {
    const chatBotId = useQuery('chatBotId')
    const user = useUser()
    const {isLoadingChatBotSubscriptions, chatBotSubscriptions} = useSubscriptions()
    const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false)
    const {t} = useTranslation()

    useEffect(() => {
        mixpanel.track_pageview({page: 'Subscribe to chat'})
    }, [])

    async function openCheckout(uid: string, chatBotId: string) {
        setIsRedirectingToCheckout(true)
        mixpanel.track('End user redirected to checkout', {chatBotId})
        const checkoutSession = await createCheckoutSession(uid,
            {
                price: 'not-used',
                mode: 'subscription',
                success_url: window.location.href + '&stripe=success',
                cancel_url: window.location.href + '&stripe=cancel',
            },
            undefined,
            chatBotId)
        window.location.assign(checkoutSession.url)
    }

    if (isLoadingChatBotSubscriptions || !chatBotId) {
        return null
    }

    if (!isSubscribedToChatBot(chatBotId!, chatBotSubscriptions)) {
        return <div className="flex flex-col items-center justify-center gap-5 h-full bg-main-100">
            {

                isRedirectingToCheckout ?
                    <>
                        <h1 className="text-center text-primary mb-4">{t('checkout.redirect', 'Redirecting to checkout...')}</h1>
                        <DotLottiePlayer src="/redirecting-paper-plane.lottie" autoplay loop/>
                    </>
                    :
                    <>
                        <h1>{t('assistant.welcome', 'Welcome to your assistant')}</h1>
                        <iframe style={{height: '15rem'}}
                            src="https://lottie.host/embed/05a3f4dd-3821-449e-9a15-18c4a6764fc0/ql3slmjXf7.json"/>
                        <button className="btn btn-primary" onClick={() => openCheckout(user.uid, chatBotId)}>
                            {t('chat.subscribe.button', 'Subscribe to chat')}
                        </button>
                    </>
            }
        </div>
    }

    return <>{children}</>
}


export const UserChatPage = () => {
    const isFree = useQuery('free')
    const chatBotId = useQuery('chatBotId')
    const {t} = useTranslation()

    if (!chatBotId) {
        mixpanel.track('Invalid assistant URL')

        return (
            <div className="flex flex-col items-center justify-center gap-5 h-full bg-main-100">
                <h1>{t('chat.missing', 'Invalid assistant URL')}</h1>
            </div>
        )
    }

    return (
        <div className="relative h-full">
            <HamburgerMenu/>
            {isFree ? (
                <UserActiveChat/>
            ):(
                <WithChatBotSubscription>
                    <UserActiveChat/>
                </WithChatBotSubscription>
            )}
        </div>
    )
}
