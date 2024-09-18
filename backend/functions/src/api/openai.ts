import {logger} from 'firebase-functions'
import OpenAI from 'openai'
import {ChatCompletionMessageParam} from 'openai/src/resources/chat/completions'
import {onFunctionsInit} from '../functions/OnFunctionsInit'

let openai: OpenAI

onFunctionsInit(() => {
    openai = new OpenAI({apiKey: process.env.OPENAI_SECRET_KEY})
})

export type AssistantInitialization = {
    assistantId: string
    threadId: string
    initialMessage: string
}

export const createThread = async () => openai.beta.threads.create()

const aiModel = 'gpt-4o-mini'

async function createAssistant(prompt: string, vectorStoreId?: string | null) {
    const assistant = await openai.beta.assistants.create({
        instructions: prompt,
        temperature: 0.1,
        model: aiModel,
        tools: [{type: 'file_search'}],
        tool_resources: vectorStoreId ? {file_search: {vector_store_ids: [vectorStoreId]}} : null,
    })
    return assistant
}

export const getInitialMessage = async (prompt: string, vectorStoreId?: string | null)
    : Promise<AssistantInitialization> => {
    const assistant = await createAssistant(prompt, vectorStoreId)

    const thread = await createThread()

    const initialMessage = await getNextMessage(assistant.id, thread.id, 'Introduce yourself briefly in 1 sentence')

    return {
        assistantId: assistant.id,
        threadId: thread.id,
        initialMessage,
    }
}

export const addMessageToThread = async (threadId: string, message: string, role: 'user' | 'assistant') => {
    logger.info('Adding message to thread', {threadId, message, role})

    return openai.beta.threads.messages.create(
        threadId,
        {
            role: role,
            content: message,
        },
    )
}

function cleanSourceMarks(message: string) {
    return message.replace(/【\d+:\d+†source】/g, '')
}

export const getNextMessage = async (assistantId: string, threadId: string, message: string) => {
    // TODO ADD LIMITS
    await addMessageToThread(threadId, message, 'user')

    const run = await openai.beta.threads.runs.createAndPoll(
        threadId,
        {
            model: aiModel,
            assistant_id: assistantId,
            response_format: {
                type: 'text',
            },
        },
    )

    if (run.status !== 'completed') {
        logger.error('Run not completed', run)
        throw new Error('AI Run not completed')
    }

    const messages = await openai.beta.threads.messages
        .list(
            run.thread_id,
            {
                order: 'desc',
                limit: 1,
            },
        )

    if (messages.data.length === 0 ||
        messages.data[0].content[0].type !== 'text' ||
        messages.data[0].role !== 'assistant'
    ) {
        logger.error('No text message', messages)
        throw new Error('AI answered with no text message')
    }

    const answerMessage = messages.data[0].content[0].text.value
    return cleanSourceMarks(answerMessage)
}

export const getNextCompletion = async (messages: ChatCompletionMessageParam[]) => {
    // Call completions api
    const response = await openai.chat.completions.create(
        {
            model: aiModel,
            messages,
            max_tokens: 500,
        },
    )

    const completion = response.choices[0].message.content

    logger.info('Completion: ', completion)
    if (!completion) {
        throw new Error('No completion')
    }
    return completion
}

export const getNextMessageStream = async (assistantId: string, threadId: string, message: string) => {
    await addMessageToThread(threadId, message, 'user')

    return openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId,
    })
}
