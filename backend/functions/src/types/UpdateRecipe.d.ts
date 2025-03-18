import {RecipeDBModel} from './recipe'

export type UpdateRecipeRequest = RecipeDBModel & { id: string }

export type UpdateRecipeResponse = {
    success: boolean;
    recipe?: RecipeDBModel;
    error?: string;
};

