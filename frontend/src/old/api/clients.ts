import {auth, functions} from '@/firebase/firebase.ts'
import {httpsCallable} from 'firebase/functions'
import {StripeConnectAccountRequest, StripeConnectAccountResponse} from '../../../../backend/functions/src/types/StripeConnect'
import {
    InitTestAssistantRequest,
    InitTestAssistantResponse,
    SendChatMessageRequest,
} from '../../../../backend/functions/src/types/TestAssistant'
import {StartEndUserChatRequest, StartEndUserChatResponse} from '../../../../backend/functions/src/types/Chat'
import {DeployRequest, DeployResponse} from '../../../../backend/functions/src/types/Deploy'
import {AddToWaitingListRequest} from "../../../../backend/functions/src/types/AddToWaitingList"

const initTestAssistantCloudFn = httpsCallable<InitTestAssistantRequest, InitTestAssistantResponse>(functions, 'initTestAssistant')
export const initTestAssistant = (req: InitTestAssistantRequest) =>
    initTestAssistantCloudFn(req).then(res => res.data)

const getApiUrl = (path: string) => {
    console.log(window.location)
    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5006' : 'https://sendchatmessage-7tducinnmq-uc.a.run.app'
    return `${baseUrl}/api/${path}`
}

export const sendChatMessage = async (
    req: SendChatMessageRequest,
    onChunk: (chunk: string) => void
): Promise<void> => {
    const response = await fetch(getApiUrl('sendChatMessage'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await auth.currentUser?.getIdToken()
        },
        body: JSON.stringify(req),
    })

    if (!response.ok) {
        throw new Error('Network response was not ok')
    }

    const reader = response.body?.getReader()
    if (!reader) {
        throw new Error('Unable to read response')
    }

    const decoder = new TextDecoder()

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                if (line.includes('[DONE]')) {
                    return
                }
                const data = JSON.parse(line.slice(6))
                onChunk(data.content)
            }
        }
    }
}

export const stripeConnectAccount = httpsCallable<StripeConnectAccountRequest, StripeConnectAccountResponse>(functions, 'stripeConnectAccount')

export const startEndUserChatFn = httpsCallable<StartEndUserChatRequest, StartEndUserChatResponse>(functions, 'startEndUserChat')
export const startEndUserChat = (req: StartEndUserChatRequest) =>
    startEndUserChatFn(req).then(res => res.data)

export const deployFn = httpsCallable<DeployRequest, DeployResponse>(functions, 'deploy')
export const deploy = (req: DeployRequest) => deployFn(req).then(res => res.data)

const addToWaitingListFn = httpsCallable<AddToWaitingListRequest, void>(functions, 'addToWaitingList')
export const addToWaitingList = (req: AddToWaitingListRequest) => addToWaitingListFn(req).then(() => undefined)
