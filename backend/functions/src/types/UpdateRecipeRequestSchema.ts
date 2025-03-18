import {z} from 'zod'
import {BaseRecipeSchema} from './BaseRecipeSchema'

// Define the UpdateRecipeRequest schema
// For updates, we need the id, and all other fields are optional
export const UpdateRecipeRequestSchema = z
    .object({
        id: z.string().describe('ID of the recipe to update'),
    })
    .merge(BaseRecipeSchema.partial())
