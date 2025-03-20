import {RecipeDBModel, RecipeIngredient, RecipePreparation} from './recipe'
import {z} from 'zod'
import { UpdateRecipeRequestSchema } from './UpdateRecipeRequestSchema';

export type UpdateRecipeRequest = z.infer<typeof UpdateRecipeRequestSchema>

export type UpdateRecipeResponse = {
    success: boolean;
    recipe?: RecipeDBModel;
    error?: string;
};

