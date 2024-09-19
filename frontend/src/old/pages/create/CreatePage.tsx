import {AssistantDefinitionSection} from './AssistantDefinitionSection.tsx'
import {AssistantTestingSection} from './AssistantTestingSection.tsx'
import {useState} from 'react'
import {initTestAssistant} from '@/old/api/clients.ts'
import mixpanel from 'mixpanel-browser'
import {useChatBotConfig} from '@/old/contexts/ChatBotConfig.tsx'
import {useWindowBreakpoint} from '@/old/react/breakpoints.ts'
import {getTestChat} from '@/old/chat/ChatDAO.ts'
import {FullPageModal} from '@/old/react/modal.tsx'

export const CreatePage = () => {
    const {config, setConfigState} = useChatBotConfig()
    const [isCreatingAssistant, setIsCreatingAssistant] = useState<boolean>(false)
    const [openSection, setOpenSection] = useState<'definition' | 'testing'>('definition')
    const {isLgOrBigger} = useWindowBreakpoint()

    const onStartTesting = async (assistantDescription: string) => {
        if (config.testChatId) {
            const chat = await getTestChat(config.testChatId)
            if (chat?.assistantPrompt === assistantDescription && !config.files?.some(file => !file.openaiId)) {
                // TODO THER IS A BUG, WHEN THEY JUST DELETE A FILE THIS IS NOT TAKEN INTO ACCOUNT
                console.log('Already testing this assistant')
                setOpenSection('testing')
                return
            }
        }

        setIsCreatingAssistant(true)
        setOpenSection('testing')
        const {config: updatedConfig} = await initTestAssistant({
            assistantPrompt: assistantDescription,
        })
        mixpanel.track('Start testing', {
            chatId: updatedConfig.testChatId,
        })
        setConfigState(updatedConfig)
        setIsCreatingAssistant(false)
    }

    return <div className="flex h-full flex-row gap-4 px-4 pb-4">
        {
            isLgOrBigger ?
                <>
                    <AssistantDefinitionSection
                        onStartTesting={onStartTesting}
                        isCreatingAssistant={isCreatingAssistant}/>
                    <AssistantTestingSection isCreatingAssistant={isCreatingAssistant} testChatId={config?.testChatId}/>
                </>
                :
                openSection === 'definition' ?
                    <AssistantDefinitionSection
                        onStartTesting={onStartTesting}
                        isCreatingAssistant={isCreatingAssistant}
                    /> :
                    <FullPageModal onClose={() => setOpenSection('definition')}>
                        <AssistantTestingSection
                            isCreatingAssistant={isCreatingAssistant}
                            testChatId={config?.testChatId}
                        />
                    </FullPageModal>

        }
    </div>
}
