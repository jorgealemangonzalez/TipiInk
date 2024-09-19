import {FormEvent} from 'react'
import {PaperAirplaneIcon} from '@heroicons/react/24/outline'
import {useTranslation} from 'react-i18next'

interface TestMessageInputProps {
    message?: string,
    setMessage: (message: string) => void
    send: () => void
}

export const MessageInput = ({message, setMessage, send}: TestMessageInputProps) => {
    const {t} = useTranslation()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        send()
    }

    return <form onSubmit={handleSubmit}>
        <label className="input input-sm input-bordered border-neutral-500 mt-2 flex items-center pr-0">

            <input
                type="text"
                placeholder={t('chat.message.input.placeholder', 'Write your message')}
                className="grow"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button
                className="h-8 w-8 px-2 rounded hover:cursor-pointer hover:bg-neutral hover:text-neutral-content"
                type="submit"
            >
                <PaperAirplaneIcon/>
            </button>
        </label>
    </form>
}
