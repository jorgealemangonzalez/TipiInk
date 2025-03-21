import { z } from 'zod'

import { UpdateRecipeRequestSchema } from './UpdateRecipeRequestSchema'
import { RecipeDBModel } from './recipe'

export type UpdateRecipeRequest = z.infer<typeof UpdateRecipeRequestSchema>

export type UpdateRecipeResponse = {
    success: boolean
    recipe?: RecipeDBModel
    error?: string
}
