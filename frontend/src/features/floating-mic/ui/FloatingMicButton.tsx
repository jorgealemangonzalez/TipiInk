import { AssistantButton } from '@/features/assistant/ui/AssistantButton'

export function FloatingMicButton() {
    return (
        <div className='fixed bottom-6 right-6 z-50'>
            <AssistantButton />
        </div>
    )
}
