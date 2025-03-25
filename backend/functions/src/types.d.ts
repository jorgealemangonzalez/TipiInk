import { Request as ExpressRequest } from 'express'

declare module 'firebase-functions/lib/common/providers/https' {
    interface Request extends ExpressRequest {
        headers: Record<string, string | string[] | undefined>
        body: any
        rawBody?: Buffer
    }
}
