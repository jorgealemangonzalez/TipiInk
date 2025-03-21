import { z } from 'zod'

import { RecipeDBModel } from '../recipes/recipe'
import { CreateRecipeRequestSchema } from './CreateRecipeRequestSchema'

export type CreateRecipeRequest = z.infer<typeof CreateRecipeRequestSchema>

export type CreateRecipeResponse = {
    success: boolean
    recipe?: RecipeDBModel
    error?: string
}
