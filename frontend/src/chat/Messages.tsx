import {ReactNode} from 'react'

interface MessageProps {
    children: ReactNode
}

export function AssistantMessage({children}: MessageProps) {
    return <div className="chat chat-start">
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <img
                    alt="Chat bubble"
                    src="/botwhirl-logo.svg"/>
            </div>
        </div>
        <div className="chat-bubble">
            {children}
        </div>
    </div>
}

export function UserMessage({children}: MessageProps) {
    return <div className="chat chat-end">
        <div className="chat-bubble">{children}</div>
    </div>
}
