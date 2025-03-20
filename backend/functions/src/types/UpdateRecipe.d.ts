import { z } from 'zod'
import { RecipeDBModel } from './recipe'
import { UpdateRecipeRequestSchema } from './UpdateRecipeRequestSchema'

export type UpdateRecipeRequest = z.infer<typeof UpdateRecipeRequestSchema>

export type UpdateRecipeResponse = {
    success: boolean;
    recipe?: RecipeDBModel;
    error?: string;
};

