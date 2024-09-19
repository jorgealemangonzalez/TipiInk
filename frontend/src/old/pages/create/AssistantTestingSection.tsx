import {Chat} from '@/old/chat/Chat.tsx'
import {ReactNode} from 'react'
import {useWindowBreakpoint} from '@/old/react/breakpoints.ts'
import {useTranslation} from 'react-i18next'

function AssistantNotReadySection({children}: { children: ReactNode }) {
    return <div className="section justify-center items-center">
        {children}
    </div>
}

type AssistantTestingPanelProps = {
    testChatId?: string,
    isCreatingAssistant: boolean
}

const TestingChatDesktop = ({id}: { id: string }) => {
    return <div className="w-[390px] h-[90%]">
        <div className="mockup-phone size-full overflow-y-auto">
            <div className="camera"></div>

            <div className="display bg-main-100 h-full flex flex-col justify-end p-4 pt-7">
                <Chat id={id} isTesting={true}/>
            </div>
        </div>
    </div>
}

const TestingChatMobile = ({id}: { id: string }) => {
    return <div className="bg-main-100 size-full flex flex-col justify-end pb-4 px-4">
        <Chat id={id} isTesting={true}/>
    </div>
}

const TestingChat = ({id}: { id: string }) => {
    const {isLgOrBigger} = useWindowBreakpoint()
    return isLgOrBigger ?
        <TestingChatDesktop id={id}/> :
        <TestingChatMobile id={id}/>
}

export const AssistantTestingSection = ({
    testChatId,
    isCreatingAssistant,
}: AssistantTestingPanelProps) => {
    const {t} = useTranslation()

    return (
        <div className="lg:basis-2/3 size-full flex justify-center items-center">
            {isCreatingAssistant ?
                <AssistantNotReadySection>
                    <div className="flex flex-col items-center p-10">
                        <div className="flex flex-col justify-center items-center">
                            <h1>
                                {t('creating.assistant', 'Creating your assistant')}
                            </h1>
                        </div>
                        <iframe style={{height: '15rem'}}
                            src="https://lottie.host/embed/884575f6-fd02-495d-aa09-b85bb76a1b9b/zZ8P8Kt1Ze.json"/>
                    </div>
                </AssistantNotReadySection>
                :
                testChatId ?
                    <TestingChat id={testChatId}/>
                    :
                    <AssistantNotReadySection>
                        <h1>
                            {t('define.chatbot', 'Define your chatbot to begin the conversation')}
                        </h1>
                    </AssistantNotReadySection>
            }
        </div>
    )
}
