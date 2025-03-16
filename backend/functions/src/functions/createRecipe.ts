import { onCallWithSecretKey, Request, firestore } from '../FirebaseInit';
import { RecipeDBModel } from '../types/recipe.d';
import { CreateRecipeRequest, CreateRecipeResponse } from '../types/CreateRecipe.d';
import { logger } from 'firebase-functions';

export const createRecipe = onCallWithSecretKey(
    async (request: Request<CreateRecipeRequest>): Promise<CreateRecipeResponse> => {
        try {
            const recipeData = request.data.recipe;

            // Set default values for missing fields
            const defaultRecipe: Omit<RecipeDBModel, 'id'> = {
                name: '',
                allergens: [],
                pvp: 0,
                costPerServing: 0,
                servingsPerProduction: 1,
                productionCost: 0,
                priceVariation: 0,
                inMenu: false,
                ingredients: [],
                preparation: {
                    prePreparation: [],
                    preparation: [],
                    conservation: [],
                },
            };

            // Merge with defaults
            const completeRecipe: RecipeDBModel = {
                ...defaultRecipe,
                ...recipeData,
            } as RecipeDBModel;

            // Store in Firestore
            const recipeRef = await firestore.collection('recipes').add(completeRecipe);
            const recipe = await recipeRef.get();
            const newRecipe = recipe.data() as RecipeDBModel;

            return {
                success: true,
                recipe: newRecipe,
            };
        } catch (error) {
            logger.error('Error creating recipe:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }
);
