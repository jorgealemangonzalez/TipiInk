import { z } from 'zod'

import { NullToUndefined, RecipeDBModel } from '@tipi/shared'

import { UpdateRecipeRequestSchema } from './UpdateRecipeRequestSchema'

export type UpdateRecipeRequest = NullToUndefined<z.infer<typeof UpdateRecipeRequestSchema>>

export type UpdateRecipeResponse = {
    success: boolean
    recipe?: RecipeDBModel
    error?: string
}
