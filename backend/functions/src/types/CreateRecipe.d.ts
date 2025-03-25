import { z } from 'zod'

import { RecipeDBModel } from '@tipi/shared'

import { CreateRecipeRequestSchema } from './CreateRecipeRequestSchema'

export type CreateRecipeRequest = z.infer<typeof CreateRecipeRequestSchema>

export type CreateRecipeResponse = {
    success: boolean
    recipe?: RecipeDBModel
    error?: string
}
