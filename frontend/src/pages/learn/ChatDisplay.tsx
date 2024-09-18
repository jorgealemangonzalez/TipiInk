import { Chat } from "../../chat/Chat.tsx"
import { useWindowBreakpoint } from '../../react/breakpoints.ts'

interface ChatDisplayProps {
    selectedChatId: string | null
}

const ChatDisplayDesktop: React.FC<ChatDisplayProps> = ({ selectedChatId }) => {
    return (
        <div className="flex-grow p-4">
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[390px] h-[90%]">
                    <div className="mockup-phone size-full overflow-y-auto">
                        <div className="camera"></div>
                        <div className="display bg-main-100 h-full flex flex-col justify-end p-4 pt-7">
                            {selectedChatId && (
                                <Chat id={selectedChatId} isTesting={false} hideInput={true}/>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChatDisplayMobile: React.FC<ChatDisplayProps> = ({ selectedChatId }) => {
    return (
        <div className="bg-main-100 size-full flex flex-col justify-end pb-4 px-4">
            {selectedChatId && (
                <Chat id={selectedChatId} isTesting={false} hideInput={true}/>
            )}
        </div>
    )
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ selectedChatId }) => {
    const { isLgOrBigger } = useWindowBreakpoint()

    return isLgOrBigger ? (
        <ChatDisplayDesktop selectedChatId={selectedChatId} />
    ) : (
        <ChatDisplayMobile selectedChatId={selectedChatId} />
    )
}

export default ChatDisplay