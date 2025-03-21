import { z } from 'zod'

import { CreateRecipeRequestSchema } from './CreateRecipeRequestSchema'
import { RecipeDBModel } from './recipe'

export type CreateRecipeRequest = z.infer<typeof CreateRecipeRequestSchema>

export type CreateRecipeResponse = {
    success: boolean
    recipe?: RecipeDBModel
    error?: string
}
