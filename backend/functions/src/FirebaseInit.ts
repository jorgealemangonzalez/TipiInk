import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { logger } from 'firebase-functions'
import { ZodSchema } from 'zod'

admin.initializeApp({
    projectId: 'tipi-ink',
    storageBucket: 'tipi-ink.appspot.com',
})

export const isLocalEnvironment = () => {
    return process.env.FUNCTIONS_EMULATOR === 'true'
}

export const firestore = admin.firestore()

export const storage = admin.storage()

export { admin }

functions.setGlobalOptions({ region: 'europe-west3' })
firestore.settings({
    ignoreUndefinedProperties: true,
})

export const onCallWithSecretKey = <P, R>(handler: (request: functions.https.CallableRequest<P>) => Promise<R>) => {
    return functions.https.onCall(async request => {
        const serverSecretKey = process.env.SERVER_SECRET_KEY
        if (!serverSecretKey) {
            throw new functions.https.HttpsError('unauthenticated', 'Server secret key not found')
        }

        if (request.rawRequest.headers['x-server-secret-key'] !== serverSecretKey) {
            throw new functions.https.HttpsError('unauthenticated', 'Invalid server secret key')
        }

        return handler(request)
    })
}

export const onCallUnauthenticated = <P, R>(handler: (request: functions.https.CallableRequest<P>) => Promise<R>) => {
    return functions.https.onCall(async request => {
        return handler(request)
    })
}

export interface Request<P> extends functions.https.CallableRequest<P> {
    rawRequest: functions.https.Request
}

function snakeToCamelString(str: string): string {
    return str.replace(
        /([-_]\w)/g,
        group =>
            group
                .toUpperCase() // Turn "_a" into "_A"
                .replace(/[-_]/, ''), // Remove the underscore or hyphen
    )
}

function snakeToCamel<T>(value: T): T {
    // If it's an array, map each value through snakeToCamel
    if (Array.isArray(value)) {
        return value.map(item => snakeToCamel(item)) as unknown as T
    }

    // If it's an object and not null, convert its keys
    if (value !== null && typeof value === 'object') {
        const newObj: Record<string, unknown> = {}
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                const newKey = snakeToCamelString(key)
                newObj[newKey] = snakeToCamel((value as Record<string, unknown>)[key])
            }
        }
        return newObj as T
    }

    // If it's neither an array nor an object (primitive), just return it
    return value
}

const nullToUndefined = <T>(value: T): T => {
    if (value === null) {
        return undefined as unknown as T
    }

    if (Array.isArray(value)) {
        return value.map(item => nullToUndefined(item)) as unknown as T
    }

    if (value !== null && typeof value === 'object') {
        const newObj: Record<string, unknown> = {}
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                newObj[key] = nullToUndefined((value as Record<string, unknown>)[key])
            }
        }
        return newObj as T
    }

    return value
}


export const onAIToolRequest = <P, R>(schema: ZodSchema, handler: (request: P) => Promise<R>) => {
    return functions.https.onRequest(async (request, response) => {
        logger.debug({ body: request.body, headers: request.headers })
        if (request.headers['x-server-secret-key'] !== process.env.SERVER_SECRET_KEY) {
            logger.error({ headers: request.headers })
            response.status(401).send('Invalid secret')
            return
        }

        const results = []
        for (const toolCall of request.body.message.toolCalls) {
            let parsedBody: any
            try {
                parsedBody = nullToUndefined(schema.parse(snakeToCamel(toolCall.function.arguments)))
            } catch (error) {
                logger.error({ error })
                response.status(500).send(error instanceof Error ? error.message : 'Unknown error')
                return
            }
            logger.debug({ body: toolCall.function.arguments, parsedBody })
            const result = await handler(parsedBody)
            results.push(result)
        }
        response.send(results)
    })
}
