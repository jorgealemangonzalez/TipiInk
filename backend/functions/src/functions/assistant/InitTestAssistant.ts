// Cloud function to send completions to openAI
import {logger, runWith} from 'firebase-functions'
import {throwIfUnauthenticated} from '../../auth/throwIfUnauthenticated'
import {addTestAssistantChat} from '../../db/ChatDAO'
import {getInitialMessage} from '../../api/openai'
import {InitTestAssistantRequest, InitTestAssistantResponse} from '../../types/TestAssistant'
import {limitTestAssistantCreation} from '../../usage/UsageLimits'
import {getOrThrowChatbotConfig, updateChatbotConfig} from '../../db/ChatBotConfigDAO'
import OpenAI from 'openai'
import {storage} from '../../FirebaseInit'
import {ChatBotConfig, ChtBotConfigFile} from '../../types/ChatBotConfig'
import {onFunctionsInit} from '../OnFunctionsInit'
import {VectorStoreFilesPage} from 'openai/resources/beta/vector-stores'
import {arraysEqual} from '../../arrays/arraysEqual'
import * as FormData from 'form-data'
import axios from 'axios'

let openai: OpenAI

onFunctionsInit(() => {
    openai = new OpenAI({apiKey: process.env.OPENAI_SECRET_KEY})
})

function getFilesToRemove(vectorStoreFiles: VectorStoreFilesPage, config: ChatBotConfig) {
    return vectorStoreFiles.data.filter((deployedFile) => !config.files?.find((fileInConfig) =>
        fileInConfig.openaiId === deployedFile.id,
    )) ?? []
}

async function uploadFileToOpenAI(file: ChtBotConfigFile): Promise<{ id: string }> {
    const readStream = storage.bucket().file(file.path).createReadStream()

    const form = new FormData()

    form.append('file', readStream, file.name)
    form.append('purpose', 'assistants')

    const apiKey = process.env.OPENAI_SECRET_KEY

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/files', // Endpoint for uploading files
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${apiKey}`,
                },
            },
        )

        // Handle the response after successful upload
        console.log('File uploaded successfully:', response.data)
        return response.data
    } catch (error: any) {
        console.error('Error uploading file:', error.response?.data || error.message)
        throw error
    }
}

async function addFilesToVectorStore(filesToAdd: ChtBotConfigFile[], config: ChatBotConfig, uid: string) {
    await Promise.all(
        filesToAdd.map(async (file) => {
            logger.info('Uploading file to vector store', {
                uid,
                file,
            })
            // TODO SAVE THIS ID SO THAT WE DO NOT NEED TO UPLOAD AGAIN. IT MIGHT BE DIFFRENT TO fileUpload.id
            const uploadedFile = await uploadFileToOpenAI(file)
            const fileUpload = await openai.beta.vectorStores.files.createAndPoll(
                config.testingOpenaiVectorStoreId!,
                {file_id: uploadedFile.id},
            )

            file.openaiId = fileUpload.id
            logger.info('File uploaded to vector store', {
                uid,
                file,
            })
        }),
    )
    await updateChatbotConfig(uid, {files: config.files})
    // TODO we are modifying config.files as they are always passed in filesToAdd
}

async function updateVectorStore(config: ChatBotConfig, uid: string) {
    logger.info('Updating vector store', {
        uid,
        files: config.files,
    })
    const filesToAdd = config.files?.filter((file) => !file.openaiId)
    logger.info('Adding files to vector store', {
        uid,
        files: filesToAdd,
    })

    if (filesToAdd) {
        await addFilesToVectorStore(filesToAdd, config, uid)
    }

    const filesToRemove = getFilesToRemove(
        await openai.beta.vectorStores.files.list(config.testingOpenaiVectorStoreId!),
        config,
    )

    logger.info('Removing files from vector store', {
        uid,
        files: filesToRemove,
    })
    for (const file of filesToRemove) {
        await openai.beta.vectorStores.files.del(config.testingOpenaiVectorStoreId!, file.id)
    }
}

async function removeVectorStore(config: ChatBotConfig, uid: string) {
    logger.info('Removing vector store', {
        uid,
        vectorStoreId: config.testingOpenaiVectorStoreId,
    })
    await openai.beta.vectorStores.del(config.testingOpenaiVectorStoreId!)
    config.testingOpenaiVectorStoreId = null
    await updateChatbotConfig(uid, {testingOpenaiVectorStoreId: null})
}

async function createVectorStore(uid: string, config: ChatBotConfig) {
    logger.info('Creating vector store with all files', {
        uid,
        files: config.files,
    })
    config.testingOpenaiVectorStoreId = (await openai.beta.vectorStores.create({})).id
    logger.info('Vector store created', {
        uid,
        vectorStoreId: config.testingOpenaiVectorStoreId,
    })
}

export const initTestAssistant = runWith({
    memory: '512MB',
}).https.onCall(
    async (data: InitTestAssistantRequest, context): Promise<InitTestAssistantResponse> => {
        const {uid} = throwIfUnauthenticated(context)
        await limitTestAssistantCreation(uid, data)

        const config = await getOrThrowChatbotConfig(uid)

        if (config.files) {
            if (config.testingOpenaiVectorStoreId) {
                logger.info('Checking if knowledge base changed', {
                    uid,
                    files: config.files,
                })
                const vectorStoreFiles = await openai.beta.vectorStores.files.list(config.testingOpenaiVectorStoreId!)
                const vectorStoreFileIds = vectorStoreFiles.data.map((file) => file.id)
                const configFileIds = config.files?.map((file) => file.openaiId) ?? []
                const didKnowledgeBaseChanged = !arraysEqual(
                    vectorStoreFileIds,
                    configFileIds,
                )
                if (didKnowledgeBaseChanged) {
                    logger.info('Knowledge base changed, updating vector store', {
                        uid,
                        files: config.files,
                    })
                    await updateVectorStore(config, uid)
                } else {
                    logger.info('Knowledge base did not change', {
                        uid,
                        files: config.files,
                    })
                }
            } else {
                // Create vector store
                await createVectorStore(uid, config)
                await updateChatbotConfig(uid, {testingOpenaiVectorStoreId: config.testingOpenaiVectorStoreId})
                await addFilesToVectorStore(config.files, config, uid)
            }
        } else {
            if (config.testingOpenaiVectorStoreId) {
                // Delete vector store
                await removeVectorStore(config, uid)
            }
        }

        const completion = await getInitialMessage(data.assistantPrompt, config.testingOpenaiVectorStoreId)
        // const completion = 'This is a completion InitTestAssistant test'
        const testChatId = await addTestAssistantChat(uid, data.assistantPrompt, completion)
        await updateChatbotConfig(uid, {testChatId})

        const updatedConfig = await getOrThrowChatbotConfig(uid)
        logger.info('Test assistant created', {
            uid,
            config: updatedConfig,
        })

        return {config: updatedConfig}
    },
)
