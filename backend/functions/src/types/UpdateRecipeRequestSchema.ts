import {z} from 'zod'
import {BaseRecipeSchema} from './BaseRecipeSchema'

// Define the UpdateRecipeRequest schema
// For updates, we need the id, and all other fields are optional
export const UpdateRecipeRequestSchema = z
    .object({
        id: z.string().describe('ID of the recipe to update'),
        ingredientsToRemove: z
            .array(z.string())
            .optional()
            .describe('List of ingredients names to remove from the recipe, exactly extracted from the knowledge base'), // Same name as in Trieve
    })
    .merge(BaseRecipeSchema.partial())
