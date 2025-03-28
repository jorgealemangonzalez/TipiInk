import { z } from 'zod'

import { RecipeDBModel } from '@tipi/shared'
import { NullToUndefined } from '@tipi/shared'

import { CreateRecipeRequestSchema } from './CreateRecipeRequestSchema'

export type CreateRecipeRequest = NullToUndefined<z.infer<typeof CreateRecipeRequestSchema>>

export type CreateRecipeResponse = {
    success: boolean
    recipe?: RecipeDBModel
    error?: string
}
