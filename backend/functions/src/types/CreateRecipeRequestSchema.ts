import { z } from 'zod'

import { BaseRecipeSchema } from './BaseRecipeSchema'

// Define the CreateRecipeRequest schema
export const CreateRecipeRequestSchema = z.object({
    recipe: BaseRecipeSchema,
})
