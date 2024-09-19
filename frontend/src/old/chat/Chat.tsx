import {useChat} from './useChat.ts'
import {useEffect, useState} from 'react'
import {ChatMessage} from '../../../../backend/functions/src/types/ChatBotConfig'
import {sendChatMessage} from '@/old/api/clients.ts'
import {useScrollToBottom} from '@/old/react/InvisibleVerticalScroll.tsx'
import {AssistantMessage, UserMessage} from './Messages.tsx'
import {MessageInput} from './MessageInput.tsx'
import mixpanel from 'mixpanel-browser'
import {marked} from 'marked'

interface ChatProps {
    id: string
    isTesting?: boolean
    hideInput?: boolean
}

export const Chat = ({id, isTesting = false, hideInput = false}: ChatProps) => {
    const {messages} = useChat({id: id})

    if (!messages || !messages.length) {
        // Loading
        return <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
                <span className="loading loading-lg"></span>
            </div>
        </div>
    }

    return <MessageList id={id} isTesting={isTesting} messages={messages} hideInput={hideInput}/>
}

interface MessageListProps {
    id: string
    isTesting?: boolean
    messages: ChatMessage[]
    hideInput?: boolean
}

// Add a custom renderer for links
const renderer = new marked.Renderer()
renderer.link = ({href, title, text}) => {
    return `<a href="${href}" title="${title || ''}" class="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`
}

marked.setOptions({
    renderer: renderer,
    breaks: true,
})

export const MessageList = ({id, isTesting = false, messages, hideInput = false}: MessageListProps) => {
    const [nextMessage, setNextMessage] = useState<string>('')
    const [temporalUserMessage, setTemporalUserMessage] = useState<ChatMessage>()
    const [streamingMessage, setStreamingMessage] = useState<string>('')
    const [isLoadingNextMessage, setIsLoadingNextMessage] = useState<boolean>(false)
    const {ref, scrollToBottom} = useScrollToBottom()

    const sendMessage = async () => {
        if (!nextMessage) return
        setTemporalUserMessage({role: 'user', content: nextMessage} as ChatMessage)
        setStreamingMessage('')
        setNextMessage('')
        setIsLoadingNextMessage(true)
        scrollToBottom()

        try {
            await sendChatMessage({chatId: id, message: nextMessage}, (chunk) => {
                setStreamingMessage(prev => prev + chunk)
            })
        } catch (error) {
            console.error('Error sending message:', error)
        }

        mixpanel.track('Message sent', {
            chatId: id,
            isTesting,
        })
    }

    useEffect(() => {
        scrollToBottom()
    }, [])

    useEffect(() => {
        if(isLoadingNextMessage && !streamingMessage)
            scrollToBottom()

        if (isLoadingNextMessage && streamingMessage)
            setIsLoadingNextMessage(false)
    }, [streamingMessage, isLoadingNextMessage])

    useEffect(() => {
        if (temporalUserMessage)
            setTemporalUserMessage(undefined) // Clear after every messages' refresh
    }, [messages])

    return <>
        <div className='max-h-[100%] hide-scrollbar overflow-y-auto' ref={ref}>
            {messages.map((message, idx) =>
                message.role == 'assistant' ?
                    streamingMessage && idx === messages.length - 1 ? null :
                        <AssistantMessage key={message.id}>
                            <div dangerouslySetInnerHTML={{__html: marked(message.content)}}>

                            </div>
                        </AssistantMessage>
                    :
                    <UserMessage key={message.id}>
                        {message.content}
                    </UserMessage>,
            )}
            {temporalUserMessage &&
                <UserMessage>
                    {temporalUserMessage.content}
                </UserMessage>
            }

            {isLoadingNextMessage && !streamingMessage &&
                <AssistantMessage>
                    <span className="loading loading-dots loading-xs"></span>
                </AssistantMessage>
            }

            {streamingMessage &&
                <AssistantMessage>
                    <div dangerouslySetInnerHTML={{__html: marked(streamingMessage)}}></div>
                </AssistantMessage>
            }
        </div>

        {!hideInput && (
            <MessageInput
                message={nextMessage}
                setMessage={setNextMessage}
                send={sendMessage}
            />
        )}
    </>
}
