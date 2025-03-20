import { RecipeDBModel } from './recipe'

export type CreateRecipeRequest = {
    recipe: Omit<RecipeDBModel, 'id'>;
};

export type CreateRecipeResponse = {
    success: boolean;
    recipe?: RecipeDBModel;
    error?: string;
};
